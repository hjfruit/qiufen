import express from 'express'
import { createNextServer } from '@graphql-kit/site'
import type { Express } from 'express'

/**
 * create a doc controller
 * @param app Express instance
 */
const createDocController = (app: Express) => {
  const router = express.Router()

  const handle = createNextServer({}).getRequestHandler()
  router.get('*', (req, res) => {
    return handle(req, res)
  })

  return router
}

export default createDocController
