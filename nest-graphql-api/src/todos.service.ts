import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

import { Injectable } from '@nestjs/common'
import { Todo } from './schemas/todo.schema'
import { CreateTodoInput, CreateTodoDto } from './dto/create-todo.input'

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}
  async create(createTodoDto: CreateTodoInput): Promise<Todo> {
    const createTodo: CreateTodoDto = {
      created: Date.now(),
      closed: 0,
      done: false,
      ...createTodoDto,
    }
    const createdCat = new this.todoModel(createTodo)

    return createdCat.save()
  }
  async getAll(): Promise<Todo[]> {
    return this.todoModel.find().exec()
  }
  async updateDone(id: string, done: boolean): Promise<string> {
    await this.todoModel.findOneAndUpdate(
      { _id: id },
      { done, closed: done ? Date.now() : 0 },
    )

    return id
  }
  async delete(id: string) {
    await this.todoModel.findByIdAndDelete({ _id: id })
  }
}
