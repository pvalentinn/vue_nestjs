import { Schema as Ms } from 'mongoose';
import { User } from 'src/user/user.model';

export class CreateLobbyInput {
  capacity: number;
  players: Ms.Types.ObjectId[];
}

export class ListLobbyInput {
  _id?: Ms.Types.ObjectId;
  capacity?: number;
  players?: Ms.Types.ObjectId[];
}

export class UpdateLobbyInput {
  _id: Ms.Types.ObjectId;
  capacity?: number;
  players?: Ms.Types.ObjectId[];
}