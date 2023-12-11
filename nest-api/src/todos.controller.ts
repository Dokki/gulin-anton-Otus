import {
  Controller,
  Render,
  Query,
  Body,
  Get,
  Post,
  Res,
  Req,
} from '@nestjs/common'
import { CreateTodoDto } from './dto/create-todo.dto'
import { TodosService } from './todos.service'
import { Todo } from './schemas/todo.schema'

@Controller()
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  @Render('index')
  async findAll(
    @Query('mode') mode = 'all',
    @Res() res,
  ): Promise<{
    todos: Todo[]
    left: number
    mode: { all: boolean; active: boolean; done: boolean }
  }> {
    let todos = await this.todosService.getAll()
    const active = todos.filter((todo) => !todo.done)
    const completed = todos.filter((todo) => todo.done)
    const left = active.length

    if (mode === 'active') {
      todos = active
    } else if (mode === 'done') {
      todos = completed
    }

    res.cookie('mode', mode)

    return {
      todos,
      left,
      mode: {
        all: mode === 'all',
        active: mode === 'active',
        done: mode === 'done',
      },
    }
  }

  @Post('create')
  async createPost(@Body() createTodoDto: CreateTodoDto, @Res() res) {
    await this.todosService.create(createTodoDto)

    res.redirect('/')
  }

  @Post('done')
  async done(
    @Body('done') done: string,
    @Body('id') id: string,
    @Req() req,
    @Res() res,
  ) {
    const isDone = done === '1'

    await this.todosService.updateDone(id, isDone)

    const url = req.cookies.mode !== 'all' ? `/?mode=${req.cookies.mode}` : '/'

    res.redirect(url)
  }

  @Post('delete')
  async delete(@Body('id') id: string, @Req() req, @Res() res) {
    await this.todosService.delete(id)

    const url = req.cookies.mode !== 'all' ? `/?mode=${req.cookies.mode}` : '/'

    res.redirect(url)
  }
}
