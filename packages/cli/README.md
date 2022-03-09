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
interface GraphqlKitConfig {
  /** your gk service port */
  port: number
  /** backend service config */
  endpoint: ServiceConfig
  /** local graphql schema file path */
  localSchemaFile?: string
  /** use either local schema or remote schema, if unset, remote will be used */
  schemaPolicy?: SchemaPolicy
  /** mock config */
  mock?: MockConfig
  /** playground config */
  playground?: PlaygroundConfig
}

interface ServiceConfig {
  /** backend service url */
  url: string
}

interface MockConfig {
  /** enable the mock ability while it's true */
  enable: boolean
  /** schema files used for dev env, valid when enable is true */
  schemaFiles?: string[]
  /** graphql operation name which will be mocked, ... means all operations, if unset, ... will be used */
  whiteList?: string[] | '...'
  /** value map rules, you should add all your scalar type mappers here or you'll get error */
  typeMapper: IMockOptions['mocks']
  /** graphql resolvers for operations, you can custom operation response here */
  resolvers?: IMockOptions['resolvers']
}

type SchemaPolicy = 'local' | 'remote'

interface PlaygroundConfig {
  /** request headers */
  headers?: Record<string, string>
}
```

## FAQ

- I run `yarn gk start` successfully, but i can't access the doc service in chrome.
  Be sure that your port is not in unsafe port list of chrome.
