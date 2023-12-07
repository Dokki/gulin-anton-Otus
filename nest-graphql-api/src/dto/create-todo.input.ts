import { IsString, MaxLength, MinLength, IsDefined } from 'class-validator'
import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CreateTodoInput {
  @Field(() => String)
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string
}

export class CreateTodoDto {
  readonly id?: string
  readonly title: string
  readonly done: boolean
  readonly created: number
  readonly closed: number
}
