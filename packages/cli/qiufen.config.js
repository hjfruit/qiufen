module.exports = {
  port: 9406,
  endpoint: {
    url: 'http://192.168.10.233:9406/graphql',
  },
  schemaPolicy: 'remote',
  playground: {
    headers: {
      appversioncode: 33,
      Authorization:
        'kktJLMPhAtduLA0Jl5dXqoT74nxpPLJDoYw89mMaz6nXlqgV06NtjOvr9CurARFfuki7QAMo8UTVAx+mDbH9pg==',
      'app-version': 33,
      platform: 'ios',
    },
  },
  mock: {
    enable: true,
    schemaFiles: ['../helpers/__tests__/schema.graphql'],
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
    context: {
      customers: [{ name: 'test', id: 1 }],
    },
    resolvers: {
      Query: {
        customers() {
          return {
            records: [{ customerId: 222 }, { customerId: 111 }],
          }
        },
      },
    },
  },
}
