// @ts-ignore Почему-то нет типа для compose :( хотя функция присутствует.
// Что то не так с типами, https://nodejs.org/docs/latest-v16.x/api/stream.html#streamcomposestreams
import { compose } from 'node:stream'
import { resolve } from 'node:path'
import { pipeline } from 'node:stream/promises'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { createReadStream, createWriteStream } from 'node:fs'
import { parseNames, log, toString, clean, collect } from './helpers'

const args = yargs(hideBin(process.argv)).argv as Record<string, string>
const fileNames = parseNames(args.files)
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
