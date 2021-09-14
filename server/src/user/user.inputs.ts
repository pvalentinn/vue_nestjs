import { Schema as Ms } from 'mongoose';

export class CreateUserInput {
  login: string;
}

export class ListUserInput {
  _id?: Ms.Types.ObjectId;
  login?: string;
}

export class UpdateUserInput {
  _id: Ms.Types.ObjectId;
  login?: string;
}