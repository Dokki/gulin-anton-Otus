import { Stats } from 'node:fs'
import { resolve } from 'node:path'
import { TYPES, TTreeJson } from './types'
import { getItemType, getFoldersTree, visualIterator } from './helpers'
import { run } from './index'

type TAllTypes = boolean | number | string | unknown

const projectRoot = resolve(__dirname)
const mocks = {
  getItemType: [
    {
      name: 'Node.js',
      is: 0,
      isExist: true,
      items: [
        {
          name: 'cluster',
          is: 0,
          items: [
            {
              name: 'index.js',
              is: 1,
            },
          ],
        },
        {
          name: 'domain',
          is: 0,
          items: [
            {
              name: 'error.js',
              is: 1,
            },
            {
              name: 'flow.js',
              is: 1,
            },
            {
              name: 'run.js',
              is: 1,
            },
          ],
        },
        {
          name: 'errors',
          is: 0,
          items: [
            {
              name: 'counter.js',
              is: 1,
            },
            {
              name: 'try-catch.js',
              is: 1,
            },
          ],
        },
        {
          name: 'index.js',
          is: 1,
        },
        {
          name: 'worker',
          is: 0,
          items: [],
        },
      ],
    },
  ],
  visualIterator: {
    task1: `1
├── 2
│   ├── 3
│   └── 4
└── 5
    └── 6`,
    withoutCount: `Node.js
├── cluster
│   └── index.js
├── domain
│   ├── error.js
│   ├── flow.js
│   └── run.js
├── errors
│   ├── counter.js
│   └── try-catch.js
├── index.js
└── worker`,
    withDeep: `Node.js
├── cluster
├── domain
├── errors
├── index.js
└── worker`,
    withCount: `Node.js
├── cluster
│   └── index.js
├── domain
│   ├── error.js
│   ├── flow.js
│   └── run.js
├── errors
│   ├── counter.js
│   └── try-catch.js
├── index.js
└── worker
4 directories, 7 files`,
  },
}
const countItems = (tree: TTreeJson[]): number =>
  tree.reduce((count, item): number => {
    if (item.items) count += countItems(item.items)

    return ++count
  }, 0)

describe('Tree js', () => {
  describe('Helpers functions', () => {
    it('Функция getItemType должна возвращать тип файла, 0 или 1.', () => {
      // Имитируем объект Stats с Ноды.
      const stats = (result: TAllTypes) =>
        ({
          isDirectory: () => result,
        } as Stats)

      expect(getItemType(stats(true))).toBe(TYPES.folder)
      expect(getItemType(stats(999))).toBe(TYPES.folder)
      expect(getItemType(stats('2'))).toBe(TYPES.folder)
      expect(getItemType(stats(false))).toBe(TYPES.file)
      expect(getItemType(stats(0))).toBe(TYPES.file)
      expect(getItemType(stats(''))).toBe(TYPES.file)
      expect(getItemType(stats(undefined))).toBe(TYPES.file)
    })

    it('Функция getFoldersTree должна возвращать дерево.', async () => {
      // Колбэк для подсчета файлов.
      const callback = jest.fn((item) => item)
      // На входе путь до папки и папка из которой будем собирать дерево и callback.
      const result = await getFoldersTree(projectRoot, 'Node.js', callback)
      // Сама папка Node.js
      const [root] = result
      // Рутовая папка не считается, считаем все что внутри.
      const count = countItems(root?.items ?? [])
      // Результат должен совпадать.
      expect(result).toEqual(mocks.getItemType)
      // 11 файлов и папок находится в папке Node.js.
      expect(callback).toBeCalledTimes(count)
    })

    it('Функция visualIterator должна возвращать дерево в виде string. Без deep ограничения.', () => {
      // Передаем моки дерева.
      const result = visualIterator(mocks.getItemType)

      expect(result).toEqual(mocks.visualIterator.withoutCount)
    })

    it('Функция visualIterator должна возвращать дерево в виде string. С deep ограничением.', () => {
      // Передаем моки дерева и deep === 1. Ищем только первый уровень.
      const result = visualIterator(mocks.getItemType, 1)

      expect(result).toEqual(mocks.visualIterator.withDeep)
    })
  })

  describe('Catch errors', () => {
    it('Функция run должна возвращать сообщение если переданы не правильные параметры.', async () => {
      const resultWrongPath = await run('', 1)
      const resultWrongTask = await run('1', 3)
      // Проверка на path.
      expect(resultWrongPath).toBe('The path to folder must be a specified')
      // Проверка на task.
      expect(resultWrongTask).toBe('Nothing to show')
    })

    it('Функция runTask1 должна возвращать сообщение если папка пуста или не существует.', async () => {
      const resultNotExist = await run('2', 1)
      const resultIsEmpty = await run('1/2/3', 1)
      // Проверка на существование папки.
      expect(resultNotExist).toBe('Folder is not exist')
      // Проверка на пустоту папки.
      expect(resultIsEmpty).toBe('Empty folder')
    })

    it('Функция runTask2 должна возвращать сообщение если папка пуста или не существует.', async () => {
      const resultNotExist = await run('2', 2)
      const resultIsEmpty = await run('1/2/3', 2)
      // Проверка на существование папки.
      expect(resultNotExist).toBe('Folder is not exist')
      // Проверка на пустоту папки.
      expect(resultIsEmpty).toBe('Empty folder')
    })
  })

  describe('Main functions', () => {
    it('Функция run должна возвращать дерево в виде string. Без подсчета папок и файлов.', async () => {
      const result = await run('1', 1)

      expect(result).toEqual(mocks.visualIterator.task1)
    })

    it('Функция run должна возвращать дерево в виде string. С подсчетом папок и файлов.', async () => {
      const result = await run('Node.js', 2)

      expect(result).toEqual(mocks.visualIterator.withCount)
    })
  })
})
