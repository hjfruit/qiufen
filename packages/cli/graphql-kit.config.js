module.exports = {
  port: 9406,
  endpoint: {
    url: 'http://192.168.10.233:10004/graphql',
  },
  schemaPolicy: 'local',
  localSchemaFile: '../helpers/__tests__/schema.graphql',
  mock: {
    enable: true,
    schemaFiles: [],
    scalarMap: {
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
    resolvers: {
      Query: {
        student() {
          return [
            {
              name: '1',
              books: [],
            },
            {
              name: '2',
              books: [],
            },
          ]
        },
      },
    },
  },
}
