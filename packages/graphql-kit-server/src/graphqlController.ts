import fs from 'fs'
import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema, GraphQLSchema, OperationTypeNode } from 'graphql'
import { addMocksToSchema } from '@graphql-tools/mock'
import { UrlLoader } from '@graphql-tools/url-loader'
import { loadSchema } from '@graphql-tools/load'
import { getRootTypeMap } from '@graphql-tools/utils'
import { createProxyMiddleware } from 'http-proxy-middleware'
import chalk from 'chalk'
import { renderPlaygroundPage } from 'graphql-playground-html'
import dayjs from 'dayjs'
import { extractOperationInfoFromGraphQLField } from './utils/graphql'
import { GraphqlKitConfig, IncomingMessageWithBody, PlaygroundQuery } from './types'
const BASE_PATH = '/graphql'

/**
 * create a graphql controller
 * @param {import('./server').} config
 * @param {string} ip
 */
const createGraphqlController = async (
  config: GraphqlKitConfig,
  ip: string,
) => {
  const router = express.Router()

  const {
    port,
    endpoint,
    schemaPolicy,
    remoteSchemaUrl,
    localSchemaFile,
    mock,
  } = config

  // get raw schema
  async function getRawSchema() {
    if (schemaPolicy === 'remote') {
      try {
        return await loadSchema(remoteSchemaUrl, {
          loaders: [new UrlLoader()],
        })
      } catch (err) {
        console.warn(chalk.yellow('远程schema加载失败，将尝试加载本地schema'))
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

  const mockedSchema = getMockedSchema(await getRawSchema())
  const graphqlHTTPOptions = {
    schema: mockedSchema,
  }

  // query specific query operation info in a JSON format
  router.use(`${BASE_PATH}/:operation/:name`, async (req, res) => {
    const rawSchema = await getRawSchema()
    const operation = req.params.operation as OperationTypeNode
    const operationField = getRootTypeMap(rawSchema)
      .get(operation)
      ?.getFields()[req.params.name]

    if (!operationField) {
      res.status(404).end('Not found')
    } else {
      const result = extractOperationInfoFromGraphQLField(
        operationField,
        rawSchema,
      )
      res.send(result)
    }
  })

  router.get(`${BASE_PATH}/playground`, (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    const { query, variables } = req.query as PlaygroundQuery
    const endpoint = `http://${ip}:${port}${BASE_PATH}`
    const playground = renderPlaygroundPage({
      endpoint,
      tabs: [
        {
          name: '调试',
          endpoint,
          query,
          variables,
          headers: mock.headers,
        },
      ],
    })
    res.end(playground)
  })

  // query all operations
  router.use(`${BASE_PATH}/operation`, async (req, res) => {
    const rawSchema = await getRawSchema()
    const result = {
      query: Object.values(rawSchema.getQueryType()?.getFields() || {}).map(
        operationField => {
          return extractOperationInfoFromGraphQLField(operationField, rawSchema)
        },
      ),
      mutation: Object.values(
        rawSchema.getMutationType()?.getFields() || {},
      ).map(operationField => {
        return extractOperationInfoFromGraphQLField(operationField, rawSchema)
      }),
      subscription: Object.values(
        rawSchema.getSubscriptionType()?.getFields() || {},
      ).map(operationField => {
        return extractOperationInfoFromGraphQLField(operationField, rawSchema)
      }),
    }
    res.send({
      code: 200,
      message: '请求成功',
      data: result,
    })
  })

  // reload schema
  router.use(`${BASE_PATH}/reload`, async (req, res) => {
    try {
      graphqlHTTPOptions.schema = getMockedSchema(await getRawSchema())
      res.status(200)
      res.json({ success: true })
      console.log(
        chalk.green(
          `[${req.socket.remoteAddress}]`,
          dayjs().format('HH:mm:ss'),
          '刷新schema成功',
        ),
      )
    } catch (err) {
      res.status(500)
      console.log(
        chalk.red(
          `[${req.socket.remoteAddress}]`,
          dayjs().format('HH:mm:ss'),
          '刷新schema失败',
        ),
      )
    }
  })

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
  router.use(BASE_PATH, (req, res, next) => {
    if (
      mock.enable &&
      (mock.whiteList === '...' ||
        mock.whiteList.includes(req.body.operationName))
    ) {
      console.log(
        chalk.red(
          `[${req.socket.remoteAddress}]`,
          dayjs().format('HH:mm:ss'),
          '请求mock数据 --------------- ',
          req.body.operationName,
        ),
      )
      next()
    } else {
      console.log(
        chalk.red(
          `[${req.socket.remoteAddress}]`,
          dayjs().format('HH:mm:ss'),
          '请求后端数据 --------------- ',
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
