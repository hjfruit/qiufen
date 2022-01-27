import fs from 'fs'
import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import { addMocksToSchema } from '@graphql-tools/mock'
import { UrlLoader } from '@graphql-tools/url-loader'
import { loadSchema } from '@graphql-tools/load'
import { createProxyMiddleware } from 'http-proxy-middleware'
import chalk from 'chalk'
import dayjs from 'dayjs'
import {
  genGQLStr,
  genExampleValue,
  getOperationsBySchema,
} from '@fruits-chain/graphql-kit-helpers'
import expressPlayground from 'graphql-playground-middleware-express'
import type { GraphqlKitConfig, IncomingMessageWithBody } from './interface'
import type { GraphQLSchema, OperationTypeNode } from 'graphql'
const BASE_PATH = '/graphql'

/**
 * create a graphql controller
 * @param config
 * @param ip
 */
const createGraphqlController = async (
  config: GraphqlKitConfig,
  ip: string,
) => {
  const router = express.Router()

  const { port, endpoint, schemaPolicy, localSchemaFile, mock } = config

  // get raw schema
  async function getRawSchema() {
    if (schemaPolicy === 'remote') {
      try {
        return await loadSchema(endpoint.url, {
          loaders: [new UrlLoader()],
        })
      } catch (err) {
        console.warn(
          chalk.yellow(
            'there is an error when loading a remote schema, it will try to load local schema',
          ),
        )
      }
    }
    const localSchemaString = fs.readFileSync(localSchemaFile, {
      encoding: 'utf-8',
    })
    return buildSchema(localSchemaString)
  }

  const resolvers = () => {
    return {
      ...mock.resolvers,
    }
  }

  function getMockedSchema(schema: GraphQLSchema) {
    return addMocksToSchema({ schema, mocks: mock.typeMapper, resolvers })
  }

  const rawSchema = await getRawSchema()
  const mockedSchema = getMockedSchema(rawSchema)
  const graphqlHTTPOptions = {
    schema: mockedSchema,
  }

  // serve a playground
  router.get(`${BASE_PATH}/playground`, (req, res, next) => {
    const { operationType, operationName } = req.query as {
      operationType: OperationTypeNode
      operationName: string
    }
    const operation = getOperationsBySchema(rawSchema).find(
      item => item.name === operationName && item.type === operationType,
    )
    if (!operation) {
      res.json({
        status: 404,
        message: `${operationType} ${operationName} is not found`,
      })
      return
    }
    const query = genGQLStr(operation)
    const variables = genExampleValue(
      operation.arguments,
      config.mock.typeMapper,
    )
    const endpoint = `http://${ip}:${port}${BASE_PATH}`
    const playgroundOptions = {
      endpoint,
      tabs: [
        {
          name: 'debug',
          endpoint,
          query,
          variables: JSON.stringify(variables, null, 2),
          headers: mock.headers,
        },
      ],
    }
    expressPlayground(playgroundOptions)(req, res, next)
  })

  // serve ast
  router.use(`${BASE_PATH}/ast`, async (req, res) => {
    const rawSchema = await (await getRawSchema()).toConfig().types[0]
    console.log(rawSchema)
    res.send({
      code: 200,
      message: 'success',
      data: rawSchema,
    })
  })

  // serve operations
  router.use(`${BASE_PATH}/operations`, async (req, res) => {
    const rawSchema = await getRawSchema()
    const result = getOperationsBySchema(rawSchema, config.mock.typeMapper)
    res.send({
      code: 200,
      message: 'success',
      data: result,
    })
  })

  // serve a way to refresh schema
  router.use(`${BASE_PATH}/refresh`, async (req, res) => {
    try {
      graphqlHTTPOptions.schema = getMockedSchema(await getRawSchema())
      res.status(200)
      res.json({ success: true })
      console.log(
        chalk.green(
          `[${req.socket.remoteAddress}]`,
          dayjs().format('HH:mm:ss'),
          'refresh successful',
        ),
      )
    } catch (err) {
      res.status(500)
      console.log(
        chalk.red(
          `[${req.socket.remoteAddress}]`,
          dayjs().format('HH:mm:ss'),
          'refresh failed',
        ),
      )
    }
  })

  // serve a proxy service
  const proxyMiddleware = createProxyMiddleware({
    target: endpoint.url,
    pathRewrite: {
      [BASE_PATH]: '',
    },
    changeOrigin: true,
    onProxyReq(proxyReq, req: IncomingMessageWithBody) {
      // bugfix: proxy is always in pending
      if (req.body) {
        const bodyData = JSON.stringify(req.body)
        proxyReq.write(bodyData)
      }
    },
  })
  router.post(BASE_PATH, (req, res, next) => {
    if (
      mock.enable &&
      (mock.whiteList === '...' ||
        mock.whiteList.includes(req.body.operationName))
    ) {
      console.log(
        chalk.red(
          `[${req.socket.remoteAddress}]`,
          dayjs().format('HH:mm:ss'),
          'target: mock ',
          req.body.operationName,
        ),
      )
      next()
    } else {
      console.log(
        chalk.red(
          `[${req.socket.remoteAddress}]`,
          dayjs().format('HH:mm:ss'),
          'target: backend ',
          req.body.operationName,
        ),
      )
      proxyMiddleware(req, res, next)
    }
  })
  router.use(BASE_PATH, graphqlHTTP(graphqlHTTPOptions))

  return router
}

export default createGraphqlController
