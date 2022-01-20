import fs from 'fs'
import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import { addMocksToSchema } from '@graphql-tools/mock'
import { UrlLoader } from '@graphql-tools/url-loader'
import { loadSchema } from '@graphql-tools/load'
import { createProxyMiddleware } from 'http-proxy-middleware'
import chalk from 'chalk'
import { renderPlaygroundPage } from 'graphql-playground-html'
import dayjs from 'dayjs'
import { getOperationsBySchema } from '@graphql-kit/helpers'
import type {
  GraphqlKitConfig,
  IncomingMessageWithBody,
  PlaygroundQuery,
} from './interface'
import type { GraphQLSchema } from 'graphql'
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

  const mockedSchema = getMockedSchema(await getRawSchema())
  const graphqlHTTPOptions = {
    schema: mockedSchema,
  }

  // serve a playground
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

  // serve operations
  router.use(`${BASE_PATH}/operations`, async (req, res) => {
    const rawSchema = await getRawSchema()
    const result = getOperationsBySchema(rawSchema)
    res.send({
      code: 200,
      message: '请求成功',
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
