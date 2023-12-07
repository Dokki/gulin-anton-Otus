import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { GraphQLModule } from '@nestjs/graphql'
import { Module } from '@nestjs/common'
import { join } from 'path'

import configuration from './configuration'
import { TodosService } from './todos.service'
import { TodosResolver } from './todos.resolver'
import { Todo, TodoSchema } from 'src/schemas/todo.schema'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      // @ts-expect-error Что то с типами внтури
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req, res }) => ({ req, res }),
      cors: true,
      introspection: true,
      cache: 'bounded',
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
  providers: [TodosResolver, TodosService],
})
export class TodosModule {}
