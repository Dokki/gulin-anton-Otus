import { rename, lstat } from 'node:fs/promises'
import { normalize, sep } from 'node:path'
import { existsSync } from 'node:fs'

import { logger } from '../common/helpers.js'
import { withAuth } from './init.js'

const renameFileOrFolder = async (fullPath, newName) => {
  if (!existsSync(fullPath))
    return logger.print(`File or folder "${fullPath}" do not exist`)

  const type = (await lstat(fullPath)).isDirectory() ? 'Folder' : 'File'
  const name = normalize(fullPath)
  const path = name.includes(sep) ? name.split(sep).slice(0, -1).join(sep) : ''

  try {
    await rename(name, `${path}${path ? '/' : ''}${newName}`)

    logger.success(`${type} "${name}" to "${newName}" was renamed`)
  } catch (e) {
    logger.fail(e)
  }
}

export default (program) => {
  program
    .command('rename')
    .description('Rename file or folder')
    .argument(
      '<name>',
      'Name of file or folder, also path can be provided (folder/file.ext)',
    )
    .argument(
      '<newName>',
      'New name of file or folder, without path (fileNew.ext)',
    )
    .action(
      withAuth(async (name, newName) => {
        await renameFileOrFolder(name, newName)
      }),
    )
}
