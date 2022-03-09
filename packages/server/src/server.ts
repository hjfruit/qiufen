import { createRequire } from 'module'
import { readFileSync, existsSync } from 'fs'
import express from 'express'
import bodyParser from 'body-parser'
import chalk from 'chalk'
import { buildSchema } from 'graphql'
import { UrlLoader } from '@graphql-tools/url-loader'
import { loadSchema } from '@graphql-tools/load'
import { stitchSchemas } from '@graphql-tools/stitch'
import createGraphqlController from './graphqlController'
import createDocController from './docController'
import getIPAddress from './utils/getIPAddress'
import type { GraphqlKitConfig, MockConfig } from './interface'
import type { Server } from 'http'

const require = createRequire(import.meta.url)
interface LoadSchemaOptions {
  schemaPolicy?: GraphqlKitConfig['schemaPolicy']
  endpointUrl: GraphqlKitConfig['endpoint']['url']
  localSchemaFile?: GraphqlKitConfig['localSchemaFile']
  mockSchemaFiles?: MockConfig['schemaFiles']
}

/**
 * get BuildSchema
 * @param options - options
 */
async function getGraphQLSchema({
  schemaPolicy,
  endpointUrl,
  localSchemaFile = '',
  mockSchemaFiles = [],
}: LoadSchemaOptions) {
  let backendSchema
  switch (schemaPolicy) {
    case undefined:
    case 'remote':
      try {
        backendSchema = await loadSchema(endpointUrl, {
          loaders: [new UrlLoader()],
        })
      } catch (err) {
        throw new Error('there is an error when loading a remote schema')
      }
      break
    case 'local':
      if (!localSchemaFile) {
        throw new Error(
          'there is no localSchemaFile option, you should set it in your config file',
        )
      } else if (!existsSync(localSchemaFile)) {
        throw new Error(`${localSchemaFile} is not exist`)
      } else {
        backendSchema = buildSchema(
          readFileSync(localSchemaFile, {
            encoding: 'utf-8',
          }),
        )
      }
      break
    default:
      throw new Error(`unknown schemaPolicy ${schemaPolicy}`)
  }
  return stitchSchemas({
    subschemas: [
      { schema: backendSchema },
      ...mockSchemaFiles.map((file, index) => {
        try {
          if (!file) {
            throw new Error(`schemaFiles[${index}] is not valid`)
          } else if (!existsSync(file)) {
            throw new Error(`schemaFiles[${index}] ${file} is not exist`)
          } else {
            const mockSchema = buildSchema(
              readFileSync(file, {
                encoding: 'utf-8',
              }),
            )
            return {
              schema: mockSchema,
            }
          }
        } catch (err) {
          throw err as Error
        }
      }),
    ],
  })
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

export { startServer, getGraphQLSchema }
