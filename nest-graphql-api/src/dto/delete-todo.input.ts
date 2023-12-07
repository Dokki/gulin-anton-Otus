import { IsMongoId, IsDefined } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteTodoInput {
  @Field(() => String)
  @IsDefined()
  @IsMongoId()
  id: string
}
