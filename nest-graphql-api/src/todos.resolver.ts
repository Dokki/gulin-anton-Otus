import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'

import { CreateTodoInput } from './dto/create-todo.input'
import { UpdateTodoInput } from './dto/update-todo.input'
import { DeleteTodoInput } from './dto/delete-todo.input'
import { TodosService } from './todos.service'
import { Todo } from './schemas/todo.schema'

@Resolver('todo')
export class TodosResolver {
  constructor(private readonly todosService: TodosService) {}

  @Query(() => [Todo])
  async all(): Promise<Todo[]> {
    return await this.todosService.getAll()
  }
  @Mutation(() => Todo)
  async create(@Args('todo') createTodoInput: CreateTodoInput) {
    return await this.todosService.create(createTodoInput)
  }
  @Mutation(() => Boolean)
  async done(@Args('todo') createTodoInput: UpdateTodoInput) {
    const { done = '', id = '' } = createTodoInput

    await this.todosService.updateDone(id, !!done)

    return true
  }
  @Mutation(() => Boolean)
  async delete(@Args('todo') deleteTodoInput: DeleteTodoInput) {
    await this.todosService.delete(deleteTodoInput.id)

    return true
  }
}
