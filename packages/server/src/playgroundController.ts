import path from 'path'
import express from 'express'
import {
  genGQLStr,
  genArgsExample,
  getOperationsBySchema,
} from '@fruits-chain/graphql-kit-helpers'
import { renderPlaygroundPage } from 'graphql-playground-html'
import { BASE_PATH } from './graphqlController'
import type { RenderPageOptions } from 'graphql-playground-html'
import type { GraphqlKitConfig } from './interface'
import type { GraphQLSchema, OperationTypeNode } from 'graphql'

const createPlaygroundController = (
  rawSchema: GraphQLSchema,
  config: GraphqlKitConfig,
  ip: string,
) => {
  const router = express.Router()
  const { mock, playground } = config

  router.use(
    `/graphql-playground-react`,
    express.static(path.join(__dirname, '../public/graphql-playground-react')),
  )
  // serve a playground
  router.get(`/playground`, (req, res) => {
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
    const variables = genArgsExample(operation.args, mock?.scalarMap || {})
    const endpoint = `http://${ip}:${config.port}${BASE_PATH}`
    const playgroundOptions: RenderPageOptions = {
      endpoint,
      cdnUrl: '',
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
    res.setHeader('Content-Type', 'text/html')
    const playgroundPage = renderPlaygroundPage(playgroundOptions)
    res.write(playgroundPage)
    res.end()
  })

  return router
}

export default createPlaygroundController
