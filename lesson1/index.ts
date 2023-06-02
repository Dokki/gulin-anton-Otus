import {
  ObjectEncodingOptions,
  OpenMode,
  PathLike,
  promises as fs,
} from 'node:fs'
import { FileHandle } from 'node:fs/promises'
import { Abortable } from 'node:events'
import { createServer } from 'node:http'
import { resolve } from 'node:path'

type TReadFile = (
  path: PathLike | FileHandle,
  options?:
    | (ObjectEncodingOptions &
        Abortable & {
          flag?: OpenMode | undefined
        })
    | BufferEncoding
    | null,
) => Promise<string | Buffer | null>

const base = resolve(__dirname)
const readFile: TReadFile = async (path, options) => {
  try {
    return await fs.readFile.call(fs, path, options)
  } catch (error) {
    console.error(error)

    return null
  }
}

createServer(async (req, res) => {
  const html = await readFile(`${base}/index.html`)

  if (html) {
    res.statusCode = 200
    res.setHeader('Content-type', 'text/html')
    res.end(html)
  } else {
    res.statusCode = 500
    res.setHeader('Content-type', 'text/plain')
    res.end('Something went wrong :(')
  }
}).listen(3000)
