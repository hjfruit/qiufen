/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  port: 9406,
  endpoint: {
    url: 'http://192.168.10.233:9406/graphql',
  },
  localSchemaFile: '',
  schemaPolicy: 'remote',
  mock: {
    enable: true,
    schemaFiles: [
      path.resolve(__dirname, '../helpers/__tests__/schema.graphql'),
    ],
    whiteList: '...',
    headers: {},
    typeMapper: {
      Int: () => null,
      String: () => null,
      ID: () => null,
      Boolean: () => null,
      BigDecimal: () => null,
      Float: () => null,
      Date: () => null,
      DateTime: () => null,
      Long: () => null,
    },
    resolvers: {
      Query: {},
      Mutation: {},
    },
  },
}
