import { writeFile } from 'fs/promises'
import * as path from 'path'
import { existsSync } from 'fs'
import { createRequire } from 'module'
import { Command } from 'commander'
import { isScalarType } from 'graphql'
import inquirer from 'inquirer'
import { watch } from 'chokidar'
import { getGraphQLSchema, startServer } from '@fruits-chain/qiufen-server'
import chalk from 'chalk'
import resolveDeps from 'resolve-dependencies'
import obj2str from 'stringify-object'
import { version } from '../package.json'
import { initQs } from './questions'
import { log } from './log'
import type { GraphQLSchema } from 'graphql'
import type { InitQsAnswers } from './questions'
import type { Server } from 'http'
import type { FSWatcher } from 'chokidar'
import type { GraphqlKitConfig, MockConfig } from '@fruits-chain/qiufen-server'
import type { FileMap } from 'resolve-dependencies/lib/file'

const require = createRequire(import.meta.url)

const program = new Command()
program.version(version)

const getConfigFilePath = (guard?: boolean) => {
  const configFilePath = path.join(process.cwd(), 'qiufen.config.js')
  if (guard && !existsSync(configFilePath)) {
    console.log(
      chalk.red(
        `${configFilePath} is not exist, you should use ${chalk.cyan(
          'qiufen init',
        )} to generate it`,
      ),
    )
    process.exit(1)
  }
  return configFilePath
}

// gen scalarMap automatically
const genScalarMap = (typeMap: ReturnType<GraphQLSchema['getTypeMap']>) => {
  const mapper: MockConfig['scalarMap'] = {}
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
    prompt(initQs).then(async (answers: InitQsAnswers) => {
      let scalarMap
      try {
        const graphqlSchema = await getGraphQLSchema({
          endpointUrl: answers.endpoint.url,
        })
        const typeMap = graphqlSchema.getTypeMap()
        scalarMap = genScalarMap(typeMap)
      } catch (err) {
        console.log(chalk.red(err))
        process.exit(1)
      }
      const config = {
        ...answers,
        port: +answers.port,
        mock: {
          ...answers.mock,
          scalarMap,
        },
      }

      // gen config file
      const contentStr = `module.exports = ${obj2str(config, {
        indent: '  ',
      })}`
      await writeFile(getConfigFilePath(), contentStr, 'utf-8')
      console.info(contentStr)
      console.info(
        `${chalk.greenBright(
          '🤖 A configuration file has been generated, now you can run ',
        )}${chalk.cyan('yarn/npm qiufen start')}${chalk.greenBright(
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
const getConfigDepFiles = async (configFilePath: string) => {
  let depFiles: string[] = []
  const config = (await import(configFilePath)) as GraphqlKitConfig
  if (config.mock?.enable) {
    depFiles = [...(config.mock?.schemaFiles || [])]
  }
  Object.values(resolveDeps(configFilePath).entries).forEach(entry => {
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
    const configFilePath = getConfigFilePath(true)
    let server: Server
    let watcher: FSWatcher
    const loadServer = async () => {
      server = await startServer(configFilePath)
      const configDepFiles = await getConfigDepFiles(configFilePath)
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

// create a check command
program
  .command('check')
  .description('check some config options')
  .action(async () => {
    const configFilePath = getConfigFilePath(true)
    const config = require(configFilePath) as GraphqlKitConfig

    // check scalarMap
    try {
      const graphqlSchema = await getGraphQLSchema({
        schemaPolicy: config.schemaPolicy,
        endpointUrl: config.endpoint.url,
        localSchemaFile: config.localSchemaFile,
        mockSchemaFiles: config.mock?.schemaFiles,
      })
      const typeMap = graphqlSchema.getTypeMap()
      const existScalars = Object.keys(config.mock?.scalarMap || {})
      const currScalars = Object.keys(genScalarMap(typeMap))
      const unionScalars = Array.from(new Set(currScalars.concat(existScalars)))
      const scalarsShouldBeAdded: string[] = []
      const scalarShouldBeRemoved: string[] = []
      unionScalars.forEach(scalar => {
        if (!existScalars.includes(scalar)) {
          scalarsShouldBeAdded.push(scalar)
        } else if (!currScalars.includes(scalar)) {
          scalarShouldBeRemoved.push(scalar)
        }
      })
      if (scalarsShouldBeAdded.length) {
        log.fail(
          `${scalarsShouldBeAdded.length} scalars [${scalarsShouldBeAdded}] should be added into your scalarMap`,
        )
      }
      if (scalarShouldBeRemoved.length) {
        log.fail(
          `${scalarShouldBeRemoved.length} scalars [${scalarShouldBeRemoved}] should be removed from your scalarMap`,
        )
      }
      if (
        scalarShouldBeRemoved.length === 0 &&
        scalarsShouldBeAdded.length === 0
      ) {
        log.pass(`scalarMap`)
      }
    } catch (err) {
      console.log(chalk.red(err))
      process.exit(1)
    }
  })

program.parse(process.argv)
