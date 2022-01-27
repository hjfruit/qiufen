# @fruits-chain/graphql-kit-cli

A cli for graphql-kit. Its main purpose is to serve a mock server and api docs for your graphql service.

## Install

Install with npm:

```bash
npm install @fruits-chain/graphql-kit-cli --save-dev
```

Install with yarn:

```bash
yarn add @fruits-chain/graphql-kit-cli --dev
```

## Usage

First, you should set up a configuration file:

```bash
yarn gk init
```

After that, you can start the server:

```
yarn gk start
```

Now, you can click the link to view docs or proxy your api to the mock server.

## Configuration

After running `yarn gk init`, you'll have a graphql-kit.config.js file in your directory.

```TS
module.exports = {
  port: number, // server port
  endpoint: {
    url: string, // your backend graphql service endpoint
  },
  localSchemaFile: string, // your local graphql schema file path(should be an absolute path)
  schemaPolicy: 'remote' | 'local', // schema loading policy
  mock: {
    enable: boolean, // whether enable mock
    whiteList: '...' | string[], // a list of operations which will be served by mock server, '...' means all operations will be mocked
    headers: Record<string, string>, // custom headers for playground
    typeMapper: { // the mock server will mock graphql field with these rules
      // example:
      // Int: () => 0,
      // String: '',
    },
    resolvers: {
      Query: { // the mock server will mock graphql query with these rules
        // example:
        // user: () => ({
        //   name: 'John'
        // })
      },
      Mutation: { // the mock server will mock graphql mutation with these rules
        // example:
        // login: () => true
      },
    },
  },
}
```
