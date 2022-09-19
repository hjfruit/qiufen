import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { createProxyMiddleware } from 'http-proxy-middleware'
import chalk from 'chalk'
import dayjs from 'dayjs'
import {
  getOperationsBySchema,
  removeMockDirectivesFromDocument,
} from '@fruits-chain/qiufen-helpers'
import { Kind, parse } from 'graphql'
import { addMocksToSchema } from './addMocksToSchema'
import type {
  BooleanValueNode,
  GraphQLSchema,
  OperationDefinitionNode,
} from 'graphql'
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
    preserveResolvers: true,
    globalContext: mock?.context,
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
      const body = req.body as any
      if (body) {
        const document = removeMockDirectivesFromDocument(body.query)
        const bodyData = JSON.stringify(
          Object.assign({}, body, {
            query: document,
          }),
        )
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
        proxyReq.write(bodyData)
      }
    },
  })
  // handle graphql requests
  router.post(BASE_PATH, (req, res, next) => {
    const operationMockDirectiveEnable = () => {
      const operation = parse(req.body.query, {
        noLocation: true,
      }).definitions.find(item => item.kind === Kind.OPERATION_DEFINITION) as
        | OperationDefinitionNode
        | undefined
      return (
        operation?.directives
          ?.find(item => item.name.value === 'mock')
          ?.arguments?.find(arg => arg.name.value === 'enable')?.value as
          | BooleanValueNode
          | undefined
      )?.value
    }
    const isIntrospectionQuery = req.body.operationName === 'IntrospectionQuery'
    if (
      (mock?.enable &&
        (operationMockDirectiveEnable() ??
          mock.mockDirectiveDefaultEnableValue ??
          true)) ||
      isIntrospectionQuery
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
  router.post(`${BASE_PATH}`, graphqlHTTP(graphqlHTTPOptions))

  return router
}

export default createGraphqlController
