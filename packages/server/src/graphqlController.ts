import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { addMocksToSchema } from '@graphql-tools/mock'
import { createProxyMiddleware } from 'http-proxy-middleware'
import chalk from 'chalk'
import dayjs from 'dayjs'
import { getOperationsBySchema } from '@fruits-chain/graphql-kit-helpers'
import type { GraphqlKitConfig, IncomingMessageWithBody } from './interface'
import type { GraphQLSchema } from 'graphql'

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
  const resolvers = () => {
    return {
      ...mock?.resolvers,
    }
  }

  function getMockedSchema(schema: GraphQLSchema) {
    return addMocksToSchema({ schema, mocks: mock?.typeMapper, resolvers })
  }

  const mockedSchema = getMockedSchema(rawSchema)
  const graphqlHTTPOptions = {
    schema: mockedSchema,
  }

  // serve operations
  router.use(`${BASE_PATH}/operations`, async (req, res) => {
    const result = getOperationsBySchema(rawSchema, config.mock?.typeMapper)
    res.send({
      code: 200,
      message: 'success',
      data: result,
    })
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
