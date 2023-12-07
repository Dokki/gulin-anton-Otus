import { IsMongoId, IsBoolean, IsDefined } from 'class-validator'
import { InputType, Field, PartialType } from '@nestjs/graphql'

import { CreateTodoInput } from './create-todo.input'

@InputType()
export class UpdateTodoInput extends PartialType(CreateTodoInput) {
  @Field(() => String)
  @IsDefined()
  @IsMongoId()
  id: string

  @Field(() => String)
  @IsDefined()
  @IsBoolean()
  done: string
}
