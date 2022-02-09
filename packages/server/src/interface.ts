import type { IncomingMessage } from 'http'

export interface IncomingMessageWithBody extends IncomingMessage {
  body?: unknown
}

/** service config type */
export interface ServiceConfig {
  /** backend service config */
  endpoint: {
    /** backend service url */
    url: string
  }
}

/** schema polity type */
export type SchemaPolicy = 'local' | 'remote'

/** mock config type */
export interface MockConfig {
  /** enable the mock ability while it's true */
  enable: boolean
  /** schema files used for dev env only */
  schemaFiles: string[]
  /** headers for playground request */
  headers: Record<string, string>
  /** graphql operation name witch will be mocked, '...' means all operations */
  whiteList: string[] | '...'
  /** graphql type mapper */
  typeMapper: Record<string, unknown>
  /** graphql resolvers for operations */
  resolvers: object
}

export interface GraphqlKitConfig {
  /** service port */
  port: number
  endpoint: {
    /** backend service url */
    url: string
  }
  /** local graphql schema file path */
  localSchemaFile: string
  /** use either local schema or remote schema */
  schemaPolicy: SchemaPolicy
  /** mock config */
  mock: MockConfig
}
