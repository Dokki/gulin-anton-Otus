import { readFile } from 'node:fs/promises'
import { normalize } from 'node:path'
import { existsSync } from 'node:fs'

import { logger } from '../common/helpers.js'
import { withAuth } from './init.js'

const viewFile = async (name) => {
  const realName = name.includes('.') ? name : `${name}.txt`
  const path = normalize(realName)

  if (!existsSync(path)) return logger.print(`File "${path}" do not exist`)

  try {
    const content = await readFile(path, { encoding: 'utf-8' })

    logger.print(content)
  } catch (e) {
    logger.error(e)
  }
}

export default (program) => {
  program
    .command('view')
    .description('View file contents')
    .argument(
      '<name>',
      'Name of file, also path can be provided (folder/file.ext)',
    )
    .action(
      withAuth(async (name) => {
        await viewFile(name)
      }),
    )
}
