const { createServer } = require('node:http')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')

const PORT = process.env.PORT || 3000

const favicon = readFileSync(resolve('./assets/favicon.png'))
const page = readFileSync('./assets/index.html')
const js = readFileSync('./assets/index.js')

createServer((req, res) => {
  if (req.url.includes('api'))
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({
        text: `Этот текст от бэка, TESTING STRING!
        Это новая строка с новым коммитом, чтобы запустился деплой`,
      }),
    )
  else if (req.url.includes('index.js'))
    res.writeHead(200, { 'Content-Type': 'text/javascript' }).end(js)
  else if (req.url.includes('favicon.png'))
    res.writeHead(200, { 'Content-Type': 'image/png' }).end(favicon)
  else res.writeHead(200, { 'Content-Type': 'text/html' }).end(page)
}).listen(PORT)
