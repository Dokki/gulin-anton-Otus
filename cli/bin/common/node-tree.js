import { existsSync } from 'node:fs'
import { lstat, readdir } from 'node:fs/promises'
import nodePath from 'node:path'

// Все что ниже было взято из первого домашнего задания

/***
 * Вспомогательная функция для валидации дерева.
 */
const validateTree = ({ isExist, items }) => {
  if (!isExist) return 'Folder is not exist'
  if (!items?.length) return 'Empty folder'
  return ''
}

/***
 * Функция рекурсивно собирает дерево папок и файлов в объект,
 * для последующей обработки.
 */
const getFoldersTree = async (projectRoot, argsPath, callback) => {
  const taskPath = `${projectRoot}/${argsPath}`
  const nameFolder = argsPath ? argsPath : projectRoot.split(nodePath.sep).pop()
  const isExist = existsSync(taskPath)
  const iterator = async (folderPath) => {
    const files = await readdir(folderPath)

    return await Promise.all(
      files.map(async (name) => {
        const path = `${folderPath}/${name}`
        const stats = await lstat(path)
        const item = { name, is: stats.isDirectory() }

        if (item.is) item.items = await iterator(path)

        callback && callback(item)

        return item
      }),
    )
  }

  return [
    {
      name: nameFolder,
      is: true,
      isExist,
      items: isExist ? await iterator(taskPath) : [],
    },
  ]
}

/***
 * Функция рекурсивно из объекта рисует дерево,
 * для последующего показа в консоле.
 */
const visualIterator = (items, depth = 999, nesting = 0, prefix = '') =>
  items.reduce((acc, item, index) => {
    if (!(nesting === 0 && index === 0)) acc += '\n'

    const padding = nesting > 1 ? ' '.repeat(nesting * 2) : ''
    const space = nesting === 0 ? '' : ' '

    if (prefix) acc += `${prefix}${padding.slice(1)}`
    else acc += `${padding}`

    if (nesting > 0) {
      acc += items[index + 1] !== undefined ? '├──' : '└──'
    }

    acc += `${space}${item.name}`

    if (item.items && item.items.length && nesting < depth) {
      acc += visualIterator(
        item.items,
        depth,
        nesting + 1,
        items[index + 1] !== undefined ? '│' : '',
      )
    }

    return acc
  }, '')

export const list = async ({ path, addedPath, depth }) => {
  const count = { folders: 0, files: 0 }
  const tree = await getFoldersTree(path, addedPath || '', (item) => {
    if (item.is) count.folders += 1
    else count.files += 1
  })

  const [root] = tree
  const message = validateTree(root)

  if (message) return message

  return `${visualIterator(tree, depth)}\n${count.folders} directories, ${
    count.files
  } files`
}
