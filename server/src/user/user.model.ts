import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as Ms } from 'mongoose';

@Schema()
export class User {
    _id: Ms.Types.ObjectId;

    @Prop()
    login: string;

}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);