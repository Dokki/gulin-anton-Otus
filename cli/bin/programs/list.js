import { list } from '../common/node-tree.js'
import { logger } from '../common/helpers.js'
import { withAuth } from './init.js'

const path = process.cwd()

export default (program) => {
  program
    .command('list')
    .description('List files and directories.')
    .option(
      '-p, --path [path]',
      'If path not provided then "list" get current directory',
      '',
    )
    .option('-d, --depth [depth]', 'Words for cow to say', 99)
    .action(
      withAuth(async (options) => {
        // Утилита list взята из первого домашнего задания
        const tree = await list({
          path,
          addedPath: options.path,
          depth: options.depth,
        })

        logger.print(tree)
      }),
    )
}
