module.exports = {
  extends: ['prettier'],
  root: true,
  plugins: ['react'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    requireConfigFile: false,
  },
}
