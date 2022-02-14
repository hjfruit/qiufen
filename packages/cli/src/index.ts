import { writeFile } from 'fs/promises'
import * as path from 'path'
import { existsSync } from 'fs'
import { Command } from 'commander'
import { isScalarType } from 'graphql'
import inquirer from 'inquirer'
import { watch } from 'chokidar'
import { getGraphQLSchema, startServer } from '@fruits-chain/graphql-kit-server'
import chalk from 'chalk'
import resolveDeps from 'resolve-dependencies'
import obj2str from 'stringify-object'
import { version } from '../package.json'
import { initQs } from './questions'
import type { GraphQLSchema } from 'graphql'
import type { Answers } from './questions'
import type { Server } from 'http'
import type { FSWatcher } from 'chokidar'
import type {
  GraphqlKitConfig,
  MockConfig,
} from '@fruits-chain/graphql-kit-server'
import type { FileMap } from 'resolve-dependencies/lib/file'

const program = new Command()
program.version(version)

// gen typeMapper automatically
const genTypeMapper = (typeMap: ReturnType<GraphQLSchema['getTypeMap']>) => {
  const mapper: MockConfig['typeMapper'] = {}
  Object.values(typeMap).forEach(type => {
    const typeName = type.name
    if (
      !typeName.startsWith('_') &&
      isScalarType(type) &&
      !mapper[typeName] &&
      typeName
    ) {
      mapper[typeName] = () => null
    }
  })
  return mapper
}
// create a init command
program
  .command('init')
  .description('run config initialization wizard')
  .action(() => {
    const prompt = inquirer.createPromptModule()
    prompt(initQs).then(async (answers: Answers) => {
      let typeMapper
      try {
        const graphqlSchema = await getGraphQLSchema({
          endpointUrl: answers.endpoint.url,
        })
        const typeMap = graphqlSchema.getTypeMap()
        typeMapper = genTypeMapper(typeMap)
      } catch (err) {
        console.log(chalk.red(err))
        process.exit(1)
      }
      const config = {
        ...answers,
        port: +answers.port,
        mock: {
          ...answers.mock,
          typeMapper,
        },
      }

      // gen config file
      const contentStr = `module.exports = ${obj2str(config, {
        indent: '  ',
      })}`
      await writeFile(
        path.resolve(process.cwd(), 'graphql-kit.config.js'),
        contentStr,
        'utf-8',
      )
      console.info(contentStr)
      console.info(
        `${chalk.greenBright(
          '🤖 A configuration file has been generated, now you can run ',
        )}${chalk.cyan('yarn/npm gk start')}${chalk.greenBright(
          ' to start a server',
        )}`,
      )
    })
  })

const getDepFiles = (deps: FileMap, depChain: string[]) => {
  let depFiles: string[] = []
  Object.values(deps).forEach(dep => {
    if (
      dep &&
      !dep.absPath.includes('node_modules') &&
      !depChain.includes(dep.absPath)
    ) {
      depFiles.push(dep.absPath)
      depFiles = depFiles.concat(
        getDepFiles(dep.deps, [...depChain, dep.absPath]),
      )
    }
  })
  return depFiles
}
const getConfigDepFiles = async (configPath: string) => {
  let depFiles: string[] = []
  const config = (await import(configPath)) as GraphqlKitConfig
  if (config.mock?.enable) {
    depFiles = [...(config.mock?.schemaFiles || [])]
  }
  Object.values(resolveDeps(configPath).entries).forEach(entry => {
    if (entry) {
      depFiles.push(entry.absPath)
      depFiles = depFiles.concat(getDepFiles(entry.deps, [entry.absPath]))
    }
  })
  return depFiles
}

// create a start command
program
  .command('start')
  .description('start a graphql server')
  .action(async () => {
    // validate config file
    const configPath = path.join(process.cwd(), 'graphql-kit.config.js')
    if (!existsSync(configPath)) {
      console.log(
        chalk.red(
          `${configPath} is not exist, you should use ${chalk.cyan(
            'gk init',
          )} to generate it`,
        ),
      )
      process.exit(1)
    }

    let server: Server
    let watcher: FSWatcher
    const loadServer = async () => {
      server = await startServer(configPath)
      const configDepFiles = await getConfigDepFiles(configPath)
      watcher = watch(configDepFiles, {
        ignoreInitial: true,
      }).on('all', () => {
        console.log(
          chalk.cyan('Config file has changed, server will be reload'),
        )
        server.close(async err => {
          if (!err) {
            await watcher.close()
            await loadServer()
          } else {
            console.log(chalk.red(err))
          }
        })
      })
    }

    await loadServer()
  })

program.parse(process.argv)
