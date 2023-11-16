import express, { json, urlencoded } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import { isProduction, config } from './config/index.js'
import { onError, logger } from './utils/onError.js'
import { apiRouter } from './routes/api.js'
import { router } from './routes/router.js'
import { initDB } from './db/init.js'

await initDB().catch(logger.error)

const app = express()

app.use(helmet())

if (!isProduction) app.use(morgan(':method :status: :url'))

app.use(
  cors({
    origin: config.frontend.url,
    exposedHeaders: 'token',
  }),
)
app.use(urlencoded({ extended: true }))
app.use(json())

app.use('/api', apiRouter)
app.use(router)

app.use('*', (req, res) => {
  res.sendStatus(404)
})
app.use(onError)

app.listen(config.backend.port, () => {
  logger.log('🚀 Server ready to handle requests')
})
