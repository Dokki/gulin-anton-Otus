import { mkdir, appendFile } from 'node:fs/promises'
import { normalize } from 'node:path'
import { existsSync } from 'node:fs'

import { logger } from '../common/helpers.js'
import { withAuth } from './init.js'

const createFile = async (name, content) => {
  const realName = name.includes('.') ? name : `${name}.txt`

  if (existsSync(realName))
    return logger.print(
      `File "${name}" already exist. Use update command for change file`,
    )

  try {
    await appendFile(normalize(realName), content || '', { encoding: 'utf8' })

    logger.success(`File "${realName}" was created`)
  } catch (e) {
    logger.error(e)
  }
}
const createFolder = async (name) => {
  try {
    await mkdir(normalize(name))

    logger.success(`Folder "${name}" was created`)
  } catch (e) {
    if (e.code === 'EEXIST') logger.print(`Folder "${name}" already exist`)
    if (e.code === 'ENOENT')
      logger.print(`Some folder in path do not exist. Check: ${name}`)
    else logger.fail(e)
  }
}

export default (program) => {
  program
    .command('create')
    .description('Create file or folder')
    .argument(
      '<name>',
      'Name of file or folder, also path can be provided (folder/file.ext)',
    )
    .argument('[content]', 'Initial content of file')
    .option(
      '-f, --folder [folder]',
      'If option is provided the folder will be created',
    )
    .action(
      withAuth(async (name, content, options) => {
        const { folder } = options
        const method = folder ? createFolder : createFile

        await method(name, content)
      }),
    )
}
