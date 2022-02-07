import { writeFile } from 'fs/promises'
import * as path from 'path'
import { watchFile } from 'fs'
import { Command } from 'commander'
import { isScalarType } from 'graphql'
import inquirer from 'inquirer'
import { getBuildSchema, startServer } from '@fruits-chain/graphql-kit-server'
import chalk from 'chalk'
import obj2str from 'stringify-object'
import deepMerge from 'deepmerge'
import { version } from '../package.json'
import { initQs } from './questions'
import defaultConfig from './config'

const program = new Command()
program.version(version)

// create a init command
program
  .command('init')
  .description('run config initialization wizard')
  .action(() => {
    const prompt = inquirer.createPromptModule()
    prompt(initQs).then(async answers => {
      const config = deepMerge(defaultConfig, answers)
      const typeMapper = (
        await getBuildSchema({
          schemaPolicy: config.schemaPolicy,
          endpointUrl: config.endpoint.url,
          localSchemaFile: config.localSchemaFile,
        })
      ).getTypeMap()
      Object.values(typeMapper).forEach(type => {
        const typeName = type.name
        if (
          !typeName.startsWith('_') &&
          isScalarType(type) &&
          !config.mock.typeMapper[typeName] &&
          typeName
        ) {
          config.mock.typeMapper[typeName] = () => null
        }
      })
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

// create a start command
program
  .command('start')
  .description('start a graphql server')
  .action(() => {
    const configPath = path.join(process.cwd(), 'graphql-kit.config.js')

    startServer(configPath).then(server => {
      watchFile(configPath, async () => {
        console.log(
          chalk.cyan('Config file has been changed, server will be reload'),
        )
        server.close()
        server = await startServer(configPath)
      })
    })
  })

program.parse(process.argv)
