import chalk from 'chalk'

export const log = {
  fail(msg: string) {
    console.log(
      `${chalk.bgRedBright(chalk.black(chalk.bold(` FAIL `)))} ${chalk.yellow(
        msg,
      )}`,
    )
  },
  pass(msg: string) {
    console.log(
      `${chalk.bgGreenBright(chalk.black(chalk.bold(` PASS `)))} ${msg}`,
    )
  },
}
