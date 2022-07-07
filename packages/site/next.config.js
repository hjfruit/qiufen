/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const withAntdLess = require('next-plugin-antd-less')

/** @type {import('next').NextConfig} */
const nextConfig = withAntdLess({
  async redirects() {
    return [
      {
        source: '/',
        destination: '/docs',
        permanent: true,
      },
    ]
  },
  reactStrictMode: true,
  image: {
    dangerouslyAllowSVG: true,
  },
  modifyVars: {
    'primary-color': '#e10098',
  },
  lessVarsFilePath: path.resolve('src/styles/variables.less'),
  webpack: config => {
    config.plugins = [...config.plugins]
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    }
    return config
  },
})

module.exports = nextConfig
