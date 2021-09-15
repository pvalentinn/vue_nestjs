import { Field, InputType, ObjectType} from '@nestjs/graphql';
import { Schema as Ms } from 'mongoose';
import { Lobby } from './lobby.model';

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

@InputType()
export class AddPlayerLobbyInput {
  @Field(() => String)
  id: Ms.Types.ObjectId;

  @Field(() => String)
  player_id: Ms.Types.ObjectId;
}

@ObjectType()
export class AddPlayerReturn {
  @Field(() => Boolean)
  error: boolean

  @Field(() => String, { nullable: true })
  message?: string

  @Field(() => Lobby, { nullable: true })
  result?: Lobby
}