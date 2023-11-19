import { rm, lstat } from 'node:fs/promises'
import { normalize } from 'node:path'
import { existsSync } from 'node:fs'

import { logger } from '../common/helpers.js'
import { withAuth } from './init.js'

const deleteFileOrFolder = async (name) => {
  if (!existsSync(name))
    return logger.print(`File or folder "${name}" do not exist`)

  const type = (await lstat(name)).isDirectory() ? 'Folder' : 'File'

  try {
    await rm(normalize(name), { recursive: true })

    logger.success(`${type} "${name}" was deleted`)
  } catch (e) {
    logger.fail(e)
  }
}

export default (program) => {
  program
    .command('delete')
    .description('Remove file or folder')
    .argument(
      '<name>',
      'Name of file or folder, also path can be provided (folder/file.ext)',
    )
    .action(
      withAuth(async (name) => {
        await deleteFileOrFolder(name)
      }),
    )
}
