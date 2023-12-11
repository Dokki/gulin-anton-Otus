import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'

import { TodosService } from './todos.service'
import configuration from './configuration'
import { TodosController } from './todos.controller'
import { Todo, TodoSchema } from 'src/schemas/todo.schema'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const host = config.get<string>('host')
        const port = config.get<number>('port')
        const table = config.get<string>('table')

        return {
          uri: `mongodb://${host}:${port}/${table}`,
        }
      },
    }),
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
