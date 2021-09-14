import { Field, InputType } from '@nestjs/graphql';
import { Schema as Ms } from 'mongoose';

@InputType()
export class CreateLobbyInput {
  @Field(() => Number)
  capacity: number;

  @Field(() => [String])
  players: Ms.Types.ObjectId[];
}

@InputType()
export class ListLobbyInput {
  @Field(() => String, { nullable: true })
  _id?: Ms.Types.ObjectId;

  @Field(() => Number, { nullable: true })
  capacity?: number;

  @Field(() => [String], { nullable: true })
  players?: Ms.Types.ObjectId[];
}

@InputType()
export class UpdateLobbyInput {
  @Field(() => String, { nullable: true })
  _id: Ms.Types.ObjectId;

  @Field(() => Number, { nullable: true })
  capacity?: number;

  @Field(() => [String], { nullable: true })
  players?: Ms.Types.ObjectId[];
}