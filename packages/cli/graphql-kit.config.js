module.exports = {
  port: 9406,
  endpoint: {
    url: 'http://192.168.10.233:9406/graphql',
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
