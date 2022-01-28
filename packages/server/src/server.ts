import { createRequire } from 'module'
import { readFileSync } from 'fs'
import express from 'express'
import bodyParser from 'body-parser'
import chalk from 'chalk'
import { buildSchema } from 'graphql'
import { UrlLoader } from '@graphql-tools/url-loader'
import { loadSchema } from '@graphql-tools/load'
import createGraphqlController from './graphqlController'
import createDocController from './docController'
import getIPAddress from './utils/getIPAddress'
import type { GraphqlKitConfig } from './interface'
import type { Server } from 'http'

const require = createRequire(import.meta.url)
export interface LoadSchemaOptions {
  schemaPolicy: GraphqlKitConfig['schemaPolicy']
  endpointUrl: string
  localSchemaFile: string
}

/**
 * get BuildSchema
 * @param param0 - params
 * @returns
 */
export async function getBuildSchema({
  schemaPolicy,
  endpointUrl,
  localSchemaFile,
}: LoadSchemaOptions) {
  if (schemaPolicy === 'remote') {
    try {
      return await loadSchema(endpointUrl, {
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
  if (!localSchemaFile) {
    throw new Error('load schema error')
  }
  const localSchemaString = readFileSync(localSchemaFile, {
    encoding: 'utf-8',
  })
  return buildSchema(localSchemaString)
}

/**
 * start graphql server
 * @param configPath - the absolute path of config file
 */
const startServer = (configPath: string): Promise<Server> => {
  delete require.cache[configPath]
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const config = require(configPath) as GraphqlKitConfig
      const app = express()
      const ip = getIPAddress() || '0.0.0.0'
      const port = config.port

      app.all('*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', '*')
        res.header('Access-Control-Allow-Credentials', 'true')
        res.header('Access-Control-Allow-Headers', 'authorization')
        next()
      })

      app.use(bodyParser.json())

      const graphqlController = await createGraphqlController(config, ip)
      app.use(graphqlController)

      const docController = await createDocController()
      app.use(docController)

      const server = app.listen(port, '0.0.0.0', () => {
        console.log(
          chalk.green(
            `Running a GraphQL server at http://${ip}:${port}/graphql`,
          ),
        )
        console.log(
          chalk.green(`You can view api docs at http://${ip}:${port}/`),
        )
      })

      resolve(server)
    } catch (err) {
      reject(err)
    }
  })
}

export { startServer }
