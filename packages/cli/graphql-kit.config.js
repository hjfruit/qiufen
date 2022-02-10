module.exports = {
  port: 9406,
  endpoint: {
    url: 'http://192.168.10.233:9406/graphql',
  },
  mock: {
    enable: true,
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
