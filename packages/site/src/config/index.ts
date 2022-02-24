const config = {
  development: {
    host: 'http://192.168.10.25:10005',
  },
  test: {
    host: '',
  },
  production: {
    host: '',
  },
}

export default config[process.env.NODE_ENV]
