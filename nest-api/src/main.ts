import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import { NestFactory } from '@nestjs/core'
import { join } from 'path'
import * as hbs from 'hbs'

import { TodosModule } from './todos.module'

const formatter = new Intl.DateTimeFormat('ru', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(TodosModule)

  app.use(cookieParser())
  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..', 'views'))

  hbs.registerHelper('date', (timestamp) => formatter.format(timestamp))

  app.setViewEngine('hbs')

  await app.listen(3000)
}

bootstrap()
