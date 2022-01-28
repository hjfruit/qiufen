module.exports = {
  port: 5000,
  endpoint: {
    url: 'http://192.168.10.233:5000/graphql',
  },
  localSchemaFile:
    '/Users/hjmac04/Desktop/graphql-kit/packages/helpers/__tests__/schema.graphql',
  schemaPolicy: 'remote',
  mock: {
    enable: true,
    whiteList: '...',
    headers: {
      Authorization:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjI3LCJ1bmFtZSI6IuW8uuW8uuWQjOWtpiIsIk9OQU1FIjoi5pif5qGl55Sf5LqnIiwiYXBwaWQiOjIsImlzQWRtaW4iOmZhbHNlLCJvaWQiOjUsImV4cCI6MTY0MjAzNzMyOH0.PpoSiNy2hhQOib8HdWO_x9xD2v5gYLxhyIrUXmPhUns',
    },
    typeMapper: {
      Int: () => 0,
      Long: () => 0,
      BigDecimal: () => 0,
      String: () => '',
      Boolean: () => true,
      ID: () => Math.random().toString() + Date.now(),
    },
    resolvers: {
      Query: {},
      Mutation: {},
    },
  },
}
