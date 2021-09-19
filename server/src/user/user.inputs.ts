import { Field, InputType } from '@nestjs/graphql';
import { Schema as Ms } from 'mongoose';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  login: string;

  @Field(() => String, { nullable: true })
  secret?: string;
}

@InputType()
export class ListUserInput {
  @Field(() => String, { nullable: true })
  _id?: Ms.Types.ObjectId;

  @Field(() => String, { nullable: true })
  login?: string;
}

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  _id: Ms.Types.ObjectId;

  @Field(() => String, { nullable: true })
  login?: string;
}