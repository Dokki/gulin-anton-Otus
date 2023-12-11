import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Todo } from './schemas/todo.schema'
import { CreateTodoDto } from './dto/create-todo.dto'

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
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

  async updateDone(id: string, done: boolean): Promise<void> {
    await this.todoModel.findOneAndUpdate(
      { _id: id },
      { done, closed: done ? Date.now() : 0 },
    )
  }

  async delete(id: string) {
    await this.todoModel.findByIdAndDelete({ _id: id })
  }
}
