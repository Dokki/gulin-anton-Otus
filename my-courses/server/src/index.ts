import express, { json, RequestHandler, urlencoded } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import { isProduction, config, uploadPath } from './config/index.js'
import { router } from './routes/routes.js'
import onError from './utils/onError.js'
import { initDB } from './db/index.js'

// eslint-disable-next-line no-console
await initDB().catch(console.error)

const app = express()

app.use(helmet())

if (!isProduction) app.use(morgan(':method :status: :url'))

app.use(
  cors({
    origin: config.allowedOrigin,
    exposedHeaders: 'token',
  }),
)
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(
  fileUpload({
    debug: true,
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 },
  }) as RequestHandler,
)

app.use('/images', express.static(uploadPath))
app.use('/api', router)
app.use('*', (req, res) => {
  res.sendStatus(404)
})
app.use(onError)

app.listen(config.port, () => {
  console.log('🚀 Server ready to handle requests')
})
