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
  /** the default value of enable arg in mock directive, default is true */
  mockDirectiveDefaultEnableValue: boolean
  /** schema files used for dev env, valid when enable is true */
  schemaFiles?: string[]
  /** value map rules, you should add all your scalar type mappers here or you'll get an error */
  scalarMap: IMockOptions['mocks']
  /** context for mock script in mock directive */
  context?: Record<string, unknown>
  /** graphql resolvers for operations, you can custom operation response here */
  resolvers?: IMockOptions['resolvers']
}

type SchemaPolicy = 'local' | 'remote'

interface PlaygroundConfig {
  /** request headers */
  headers?: Record<string, string>
}
```

## Directives

### @mock

#### Args

- enable

  > Type: Boolean  
  > Locations: QUERY | MUTATION

  If set and the value is `true`, the query will be mocked, otherwise the query will be forwarded to backend.

  **_example_**

  ```graphql
  query customers($page: Page, $customersInput: CustomersInput)
  @mock(enable: true) {
    customers(page: $page, customersInput: $customersInput) {
      records {
        customerId
        customerStatus
      }
      pageCurrent
      pageSize
      totalRecords
    }
  }
  ```

- err

  > Type: { code: Int!, message: String! }  
  > Locations: FIELD

  If set, the query will response a result with errors you provided.

  **_example_**

  ```graphql
  query customers($page: Page, $customersInput: CustomersInput)
  @mock(enable: true) {
    customers(page: $page, customersInput: $customersInput)
      @mock(err: { code: 500, message: "Internal error" }) {
      records {
        customerId
        customerStatus
      }
      pageCurrent
      pageSize
      totalRecords
    }
  }
  ```

- len

  > Type: String | Int  
  > Locations: FIELD

  If set and the field is of type `Array`, the result of this field will be an array with length of `len`.

  **_example_**

  ```graphql
  query customers($page: Page, $customersInput: CustomersInput)
  @mock(enable: true) {
    customers(page: $page, customersInput: $customersInput) {
      records @mock(len: 10) {
        customerId
        customerStatus
      }
      pageCurrent
      pageSize
      totalRecords
    }
  }
  ```

- val

  > Type: String | Number | Boolean | Null  
  > Locations: FIELD

  If set, the result of this field will be the value you specified.

  **_example_**

  ```graphql
  query customers($page: Page, $customersInput: CustomersInput)
  @mock(enable: true) {
    customers(page: $page, customersInput: $customersInput) {
      records @mock(len: 10) {
        customerId @mock(val: 1111)
        customerStatus
      }
      pageCurrent
      pageSize
      totalRecords
    }
  }
  ```

- fallback

  > Type: Boolean
  > Locations: FIELD

  Sometimes, the value of `val` may cause an validation/runtime error, you can ignore the error by setting `fallback` to `true`, then the result will behave as if `val` is not set.
  **_Be aware that if the error is thrown by graphql, it's not effect._**

  **_example_**

  ```graphql
  query customers($page: Page, $customersInput: CustomersInput)
  @mock(enable: true) {
    customers(page: $page, customersInput: $customersInput) {
      records @mock(len: 10) {
        customerId @mock(val: {}, fallback: true)
        customerStatus
      }
      pageCurrent
      pageSize
      totalRecords
    }
  }
  ```

### Micro script

When the value of `val` arg is of type `String` and matches the pattern %{.\*}, you'll get this power.

**_example_**

document

```graphql
query customers($page: Page, $customersInput: CustomersInput)
@mock(enable: true) {
  customers(page: $page, customersInput: $customersInput) {
    records @mock(len: "%{page.pageSize}") {
      customerId
        @mock(
          val: "%{path.prev.key + (page.pageCurrent - 1) * page.pageSize + 1}"
        )
      customerStatus
    }
    pageCurrent @mock(val: "%{page.pageCurrent}")
    pageSize @mock(val: "%{page.pageSize}")
    totalRecords @mock(val: "%{100}")
  }
}
```

variables

```json
{
  "page": {
    "pageCurrent": 2,
    "pageSize": 5
  },
  "customersInput": {
    "keyword": "str",
    "attribute": "INTERNAL"
  }
}
```

response

```json
{
  "data": {
    "customers": {
      "records": [
        {
          "customerId": 6,
          "customerStatus": "SUSPENSION"
        },
        {
          "customerId": 7,
          "customerStatus": "RESIGN"
        },
        {
          "customerId": 8,
          "customerStatus": "SUSPENSION"
        },
        {
          "customerId": 9,
          "customerStatus": "RESIGN"
        },
        {
          "customerId": 10,
          "customerStatus": "NORMAL"
        }
      ],
      "pageCurrent": 2,
      "pageSize": 5,
      "totalRecords": 100
    }
  }
}
```

As you can see, the query can response a result associated with your operation variables and some special global vars.

**Global vars**

- path

  ```ts
  interface Path {
    // parent field path
    readonly prev: Path | undefined
    // current field name
    readonly key: string | number
    // parent field type
    readonly typename: string | undefined
  }
  ```

## CLI Commands

**init**

Run config initialization wizard

**start**

Start a graphql server

**check**

Check some config options

**help**

Display help for command

## FAQ

- I run `yarn gk start` successfully, but i can't access the doc service in chrome.

  Be sure that your port is not in unsafe port list of chrome.
