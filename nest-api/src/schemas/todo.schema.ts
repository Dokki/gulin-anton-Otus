import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type TodoDocument = HydratedDocument<Todo>

@Schema()
export class Todo {
  @Prop()
  id: string

  @Prop({ required: true, type: String })
  title: string

  @Prop({ type: Boolean })
  done: boolean

  @Prop({ type: Number })
  created: number

  @Prop({ type: Number })
  closed: number
}

export const TodoSchema = SchemaFactory.createForClass(Todo)
