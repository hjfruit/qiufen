import type { GraphqlKitConfig } from '@graphql-kit/server'

const config: GraphqlKitConfig = {
  port: 9406,
  endpoint: {
    url: '',
  },
  localSchemaFile: '',
  schemaPolicy: 'remote',
  mock: {
    enable: true,
    whiteList: '...',
    headers: {},
    typeMapper: {},
    resolvers: {
      Query: {},
      Mutation: {},
    },
  },
}

export default config
