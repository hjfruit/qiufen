import type { IResolvers } from '@graphql-tools/utils'
import type { ScalarMap } from '@fruits-chain/graphql-kit-helpers'
import type { IncomingMessage } from 'http'

export interface IncomingMessageWithBody extends IncomingMessage {
  body?: unknown
}

export interface ServiceConfig {
  /** backend service url */
  url: string
}

export interface PlaygroundConfig {
  /** request headers */
  headers?: Record<string, string>
}

/** schema polity type */
export type SchemaPolicy = 'local' | 'remote'

/** mock config type */
export interface MockConfig {
  /** enable the mock ability while it's true */
  enable: boolean
  /** schema files used for dev env, valid when enable is true */
  schemaFiles?: string[]
  /** graphql operation name which will be mocked, ... means all operations, if unset, ... will be used */
  whiteList?: string[] | '...'
  /** scalar value map rules, you should add all your scalar type here or you'll get an error */
  scalarMap: ScalarMap
  /** graphql resolvers for operations, you can custom operation response here */
  resolvers?: IResolvers
}

export interface GraphqlKitConfig {
  /** your gk service port */
  port: number
  /** backend service config */
  endpoint: ServiceConfig
  /** local graphql schema file path */
  localSchemaFile?: string
  /** use either local schema or remote schema, if unset, remote will be used */
  schemaPolicy?: SchemaPolicy
  /** mock config */
  mock?: MockConfig
  /** playground config */
  playground?: PlaygroundConfig
}
