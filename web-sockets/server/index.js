import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { WebSocketServer } from 'ws'
import { resolve } from 'node:path'
import ryba from 'ryba-js'

const wss = new WebSocketServer({ port: 4000 })

wss.on('connection', (socket) => {
  // eslint-disable-next-line no-console
  socket.on('error', console.error)

  setInterval(() => {
    socket.send(ryba())
  }, 4000)
})

const favicon = readFileSync(resolve('./client/favicon.png'))
const worker = readFileSync('./client/web-worker.js')
const page = readFileSync('./client/index.html')
const js = readFileSync('./client/index.js')

createServer(function (req, res) {
  if (req.url.includes('web-worker.js'))
    res.writeHead(200, { 'Content-Type': 'text/javascript' }).end(worker)
  else if (req.url.includes('index.js'))
    res.writeHead(200, { 'Content-Type': 'text/javascript' }).end(js)
  else if (req.url.includes('favicon.png'))
    res.writeHead(200, { 'Content-Type': 'image/png' }).end(favicon)
  else res.writeHead(200, { 'Content-Type': 'text/html' }).end(page)
}).listen(3000)
