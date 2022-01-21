import * as path from 'path'
import createServer from 'next'
import type { NextServerOptions } from 'next/dist/server/next'

export const createNextServer = (options: NextServerOptions) => {
  return createServer({
    ...options,
    dir: path.resolve(__dirname, '..'),
  })
}
