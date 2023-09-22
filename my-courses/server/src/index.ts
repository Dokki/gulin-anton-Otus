import express, { json, RequestHandler, urlencoded } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import { join } from 'path'
import { isProduction, config, rootDir } from './config/index.js'
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

if (isProduction) {
  app.use(express.static(join(rootDir, '../../client/build')))
  // Нужно на продакшене настроить картинки
  //app.use('/images', express.static(rootDir + '../build/images'));
} else {
  app.use('/images', express.static(join(rootDir, '/images')))
}

app.use('/api', router)
app.use('*', (req, res) => {
  res.sendStatus(404)
})
app.use(onError)

app.listen(config.port, () => {
  console.log('🚀 Server ready to handle requests')
})
