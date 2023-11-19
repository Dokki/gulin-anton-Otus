import { writeFile, readFile } from 'node:fs/promises'
import { normalize } from 'node:path'
import { existsSync } from 'node:fs'

import { logger } from '../common/helpers.js'
import { withAuth } from './init.js'

const updateFile = async (name, content, replace = false) => {
  const realName = name.includes('.') ? name : `${name}.txt`
  const path = normalize(realName)

  if (!existsSync(path)) return logger.print(`File "${path}" do not exist`)

  let oldContent = ''

  if (!replace) oldContent = await readFile(path, { encoding: 'utf-8' })

  try {
    await writeFile(
      path,
      `${oldContent || ''}${oldContent ? '\n' : ''}${content || ''}`,
      {
        encoding: 'utf8',
      },
    )

    logger.success(
      `File "${path}" was update by "${replace ? 'replace' : 'append'}" method`,
    )
  } catch (e) {
    logger.error(e)
  }
}

export default (program) => {
  program
    .command('update')
    .description('Update file contents')
    .argument(
      '<name>',
      'Name of file, also path can be provided (folder/file.ext)',
    )
    .argument('<content>', 'Content that will be updated in the file')
    .option(
      '-r, --replace [replace]',
      'Option will replace the content instead of append',
      false,
    )
    .action(
      withAuth(async (name, content, options) => {
        const { replace } = options

        await updateFile(name, content, replace)
      }),
    )
}
