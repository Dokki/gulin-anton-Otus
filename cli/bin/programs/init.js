import cow from 'cowsay'
import chalk from 'chalk'
import clear from 'clear-any-console'
import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'
import { dirname, resolve, normalize } from 'node:path'

import { getAuth } from '../common/db.js'
import { logger } from '../common/helpers.js'

const { name, author, version, license, description } = await (async () => {
  const path = resolve(
    normalize(dirname(fileURLToPath(import.meta.url))),
    '../../package.json',
  )

  try {
    const packageJson = await readFile(path, {
      encoding: 'utf-8',
    })

    return JSON.parse(packageJson)
  } catch (e) {
    return {}
  }
})()

export const withAuth =
  (action) =>
  async (...args) => {
    const isAuth = await getAuth()

    if (isAuth) await action(...args)
    else
      logger.warn(
        cow.say({
          text: 'You need to logged in. Use "auth" command',
          e: 'o 0',
        }),
      )
  }

export default (program) => {
  program.configureOutput({
    writeOut: (str) => process.stdout.write(`[OUT] ${str}`),
    writeErr: (str) => process.stdout.write(`[ERR] ${str}`),
    outputError: (str, write) => write(chalk.red(str)),
  })

  program
    .name(name)
    .version(version)
    .description(
      `${description}. Author: ${author}. License: ${license}.
For use utility need authorization.`,
    )
    .configureHelp({ showGlobalOptions: true })
    .hook('preAction', () => {
      clear()
    })
    .option('-v, --verbose [type]', 'Level of logger', '4')
}
