module.exports = {
  port: 9406,
  endpoint: {
    url: 'http://192.168.10.233:10004/graphql',
  },
  schemaPolicy: 'remote',
  localSchemaFile: '../helpers/__tests__/schema.graphql',
  mock: {
    enable: true,
    schemaFiles: [],
    typeMapper: {
      String: () => 'str',
      ID: () => 'id',
      Int: () => 1,
      BigDecimal: () => 1001,
      Boolean: () => true,
      Date: () => Date.now(),
      DateTime: () => Date.now(),
      Long: () => 101,
      Object: () => ({}),
    },
  },
}
