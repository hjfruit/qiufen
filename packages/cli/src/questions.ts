/**
 * questions for config initialization wizard
 */
export const initQs = [
  {
    type: 'input',
    name: 'port',
    message: 'input your graphql service port',
    validate(input: string) {
      const port = +input
      if (!input.trim()) {
        return 'port is required'
      }
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
    message: 'input your backend graphql service url',
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
    type: 'confirm',
    name: 'mock.enable',
    message: 'whether enable mock',
  },
]
export interface InitQsAnswers {
  port: number
  endpoint: {
    url: string
  }
  mock: {
    enable: boolean
  }
}
