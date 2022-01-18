import express from 'express'
import bodyParser from 'body-parser'
import chalk from 'chalk'
import { createRequire } from 'module'

import createGraphqlController from './graphqlController.js'
import createDocController from './docController.js'
import { getIPAddress } from './utils/common.js'
import { Server } from 'http'
import { GraphqlKitConfig } from './types'

const require = createRequire(import.meta.url)

/**
 * start graphql server
 * @param {string} configPath the absolute path of config file
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

      const docController = await createDocController(app)
      app.use(docController)

      const server = app.listen(port, '0.0.0.0', () => {
        console.log(
          chalk.green(
            `Running a GraphQL server at http://${ip}:${port}/graphql`,
          ),
        )
        console.log(
          chalk.green(`You can view api doc at http://${ip}:${port}/`),
        )
      })

      resolve(server)
    } catch (err) {
      reject(err)
    }
  })
}

export { startServer }
