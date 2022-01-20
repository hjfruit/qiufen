import type { GraphqlKitConfig } from '@/../server/dist/types'

type Answers = GraphqlKitConfig

export const initQs = [
  {
    type: 'input',
    name: 'port',
    filter(input: string) {
      return +input
    },
    validate(input: string) {
      const port = +input
      if (isNaN(port)) {
        return 'the port should be a number'
      }
      if (port < 0 || port > 65535) {
        return 'the port should be an integer between 0 and 65535'
      }
      return true
    },
  },
  {
    type: 'input',
    name: 'endpoint.url',
    validate(input: string) {
      const urlRegexp =
        /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i
      if (!urlRegexp.test(input)) {
        return 'not a valid url'
      }
      return true
    },
  },
  {
    type: 'input',
    name: 'localSchemaFile',
  },
  {
    type: 'list',
    name: 'schemaPolicy',
    choices: ['local', 'remote'],
    when(answers: Answers) {
      return !!answers.localSchemaFile
    },
  },
  {
    type: 'confirm',
    name: 'mock.enable',
  },
]
