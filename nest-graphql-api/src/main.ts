import { NestExpressApplication } from '@nestjs/platform-express'
import { NestFactory } from '@nestjs/core'

import { TodosModule } from './todos.module'

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(TodosModule)

  await app.listen(3000)
}

bootstrap()
