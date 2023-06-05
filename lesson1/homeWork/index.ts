import { resolve } from 'node:path'
import { parseArgs, getFoldersTree, visualIterator } from './helpers'
import { TYPES, TTreeJson } from './types'

const [, , task, pathToFolder, depthArg] = process.argv
const args = parseArgs(task, pathToFolder, depthArg)
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

  if (!tree.length) return 'Empty folder'

  return visualIterator(tree, args.depth as number)
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

  if (!tree.length) return 'Empty folder'

  return `${visualIterator(tree, args.depth as number)} ${
    count.folders
  } directories, ${count.files} files`
}

const run = async () => {
  switch (args.task) {
    case 1:
      // eslint-disable-next-line no-console
      console.log(await runTask1(args.path as string))
      break
    case 2:
      // eslint-disable-next-line no-console
      console.log(await runTask2(args.path as string))
      break
    default:
      // eslint-disable-next-line no-console
      console.log('Nothing to show')
  }
}

run()
