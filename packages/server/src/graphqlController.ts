import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { addMocksToSchema } from '@graphql-tools/mock'
import { createProxyMiddleware } from 'http-proxy-middleware'
import chalk from 'chalk'
import dayjs from 'dayjs'
import {
  genGQLStr,
  genArgsExample,
  getOperationsBySchema,
} from '@fruits-chain/graphql-kit-helpers'
import expressPlayground from 'graphql-playground-middleware-express'
import { getGraphQLSchema } from './server'
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

  const { port, endpoint, schemaPolicy, localSchemaFile, mock, playground } =
    config

  const resolvers = () => {
    return {
      ...mock?.resolvers,
    }
  }

  function getMockedSchema(schema: GraphQLSchema) {
    return addMocksToSchema({ schema, mocks: mock?.typeMapper, resolvers })
  }

  const getRawSchema = async () => {
    try {
      const schema = await getGraphQLSchema({
        schemaPolicy,
        localSchemaFile,
        endpointUrl: endpoint.url,
        mockSchemaFiles: mock?.schemaFiles,
      })
      return schema
    } catch (err) {
      console.log(chalk.red(err))
      process.exit(1)
    }
  }

  const rawSchema = await getRawSchema()
  const mockedSchema = getMockedSchema(rawSchema)
  const graphqlHTTPOptions = {
    schema: mockedSchema,
    graphiql: true,
  }

  // serve a playground
  router.get(`${BASE_PATH}/playground`, (req, res, next) => {
    const { operationType, operationName } = req.query as {
      operationType: OperationTypeNode
      operationName: string
    }
    const operation = getOperationsBySchema(rawSchema).find(
      item =>
        item.name === operationName && item.operationType === operationType,
    )
    if (!operation) {
      res.json({
        status: 404,
        message: `${operationType} ${operationName} is not found`,
      })
      return
    }
    const query = genGQLStr(operation)
    const variables = genArgsExample(
      operation.args,
      config.mock?.typeMapper || {},
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
          headers: playground?.headers,
        },
      ],
    }
    expressPlayground(playgroundOptions)(req, res, next)
  })

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
