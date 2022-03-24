module.exports = {
  port: 9406,
  endpoint: {
    url: 'http://192.168.10.233:9406/graphql',
  },
  schemaPolicy: 'remote',
  localSchemaFile: '../helpers/__tests__/schema.graphql',
  mock: {
    enable: true,
    schemaFiles: [],
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
  },
}
