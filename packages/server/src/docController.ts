import express from 'express'
import { createNextServer } from '@fruits-chain/qiufen-site'

/**
 * create a doc controller
 */
const createDocController = () => {
  const router = express.Router()

  const handle = createNextServer({}).getRequestHandler()
  router.get('*', (req, res) => {
    return handle(req, res)
  })

  return router
}

export default createDocController
