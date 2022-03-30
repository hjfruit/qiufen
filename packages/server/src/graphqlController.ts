import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { createProxyMiddleware } from 'http-proxy-middleware'
import chalk from 'chalk'
import dayjs from 'dayjs'
import { getOperationsBySchema } from '@fruits-chain/graphql-kit-helpers'
import { addMocksToSchema } from './directives/mock'
import type { GraphQLSchema } from 'graphql'
import type { GraphqlKitConfig, IncomingMessageWithBody } from './interface'

export const BASE_PATH = '/graphql'

/**
 * create a graphql controller
 * @param config
 * @param ip
 */
const createGraphqlController = async (
  config: GraphqlKitConfig,
  rawSchema: GraphQLSchema,
) => {
  const router = express.Router()
  const { endpoint, mock } = config

  // serve operations
  router.use(`${BASE_PATH}/operations`, async (req, res) => {
    const result = getOperationsBySchema(rawSchema, mock?.scalarMap)
    res.send({
      code: 200,
      message: 'success',
      data: result,
    })
  })

  const mockedSchema = addMocksToSchema({
    schema: rawSchema,
    scalarMap: mock?.scalarMap,
    resolvers: mock?.resolvers,
  })
  const graphqlHTTPOptions = {
    schema: mockedSchema,
  }
  // create a proxy to backend service
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
  // handle graphql requests
  router.post(BASE_PATH, (req, res, next) => {
    if (
      mock?.enable &&
      (mock.whiteList === '...' ||
        mock.whiteList === undefined ||
        mock.whiteList?.includes(req.body.operationName))
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
