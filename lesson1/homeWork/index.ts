import { resolve } from 'node:path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { getFoldersTree, visualIterator, log } from './helpers'
import { TYPES, TTreeJson, TArgs } from './types'

const args = yargs(hideBin(process.argv)).default({ depth: 999 })
  .argv as unknown as TArgs
const projectRoot = resolve(__dirname)

/**
 * Функция для отображения в консоле дерева,
 * в таком виде.
 * 1
 * ├── 2
 * │   ├── 3
 * │   └── 4
 * └── 5
 *     └── 6
 */
const runTask1 = async (path: string) => {
  const tree = await getFoldersTree(projectRoot, path)
  const [root] = tree

  if (!root.items?.length) return 'Empty folder'

  return visualIterator(tree, args.depth)
}
/**
 * Функция для отображения в консоле дерева,
 * в таком виде.
 * Node.js
 * ├── cluster
 * │   └── index.js
 * ├── domain
 * │   ├── error.js
 * │   ├── flow.js
 * │   └── run.js
 * ├── errors
 * │   ├── counter.js
 * │   └── try-catch.js
 * ├── index.js
 * └── worker
 *  4 directories, 7 files
 */
const runTask2 = async (path: string) => {
  const count = { folders: 0, files: 0 }
  const tree = await getFoldersTree(projectRoot, path, (item: TTreeJson) => {
    if (item.is === TYPES.folder) count.folders += 1
    else count.files += 1
  })
  const [root] = tree

  if (!root.items?.length) return 'Empty folder'

  return `${visualIterator(tree, args.depth)} ${count.folders} directories, ${
    count.files
  } files`
}

const run = async () => {
  switch (args.task) {
    case 1:
      log(await runTask1(args.path))
      break
    case 2:
      log(await runTask2(args.path))
      break
    default:
      log('Nothing to show')
  }
}

run().catch(log)
