import type { addMocksToSchema } from '@graphql-tools/mock'
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

export type IMockOptions = Parameters<typeof addMocksToSchema>[0]

/** schema polity type */
export type SchemaPolicy = 'local' | 'remote'

/** mock config type */
export interface MockConfig {
  /** enable the mock ability while it's true */
  enable: boolean
  /** schema files used for dev env, valid when enable is true */
  schemaFiles?: string[]
  /** graphql operation name witch will be mocked, ... means all operations, if unset, ... will be used */
  whiteList?: string[] | '...'
  /** value map rules, you should add all your scalar type mappers here*/
  typeMapper: IMockOptions['mocks']
  /** graphql resolvers for operations, you can custom operation response here */
  resolvers?: IMockOptions['resolvers']
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
