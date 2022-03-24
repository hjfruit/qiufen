const config = {
  development: {
    host: 'http://localhost:9406',
  },
  test: {
    host: '',
  },
  production: {
    host: '',
  },
}

export default config[process.env.NODE_ENV]
