// @ts-ignore Почему-то нет типа для compose :( хотя функция присутствует.
// Что то не так с типами, https://nodejs.org/docs/latest-v20.x/api/stream.html#streamcomposestreams
import { compose } from 'node:stream'
import { resolve } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { createReadStream, createWriteStream } from 'node:fs'
import { parseArgs, log, toString, clean, collect } from './helpers'

const [, , words] = process.argv
const args = parseArgs(words)
const fileNames = (args.files as string[]) || []
const projectRoot = resolve(__dirname)

const run = async () =>
  await Promise.all(
    fileNames.map(async (fileName) => {
      const source = createReadStream(`${projectRoot}/${fileName}.txt`)
      const target = createWriteStream(`${projectRoot}/${fileName}Result.txt`)

      source.setEncoding('utf8')

      await pipeline(source, compose(toString, clean, collect), target)

      source.close()
      target.close()

      log('Done:', fileName)
    }),
  )

run().catch(log)
