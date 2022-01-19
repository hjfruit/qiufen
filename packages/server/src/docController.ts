import express from 'express'
import type { Express } from 'express'

/**
 * create a doc controller
 */
const createDocController = (app: Express) => {
  const router = express.Router()

  app.use(express.static(new URL('../doc-site', import.meta.url).pathname))

  router.get('*', (req, res) => {
    res.sendFile(new URL('../doc-site/index.html', import.meta.url).pathname)
  })

  return router
}

export default createDocController
