import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectType, Field } from '@nestjs/graphql'
import { Schema as MongoSchema } from 'mongoose'

@ObjectType()
@Schema()
export class Todo {
  @Field(() => String, { nullable: true })
  id: MongoSchema.Types.ObjectId

  @Field(() => String)
  @Prop({ required: true, type: String })
  title: string

  @Field(() => Boolean)
  @Prop()
  done: boolean

  @Field(() => Number)
  @Prop()
  created: number

  @Field(() => Number)
  @Prop()
  closed: number
}

export const TodoSchema = SchemaFactory.createForClass(Todo)
