import type { GraphqlKitConfig } from '@fruits-chain/graphql-kit-server'

// default config for graphql-kit
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
