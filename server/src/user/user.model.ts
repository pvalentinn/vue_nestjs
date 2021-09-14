import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as Ms } from 'mongoose';

@ObjectType()
@Schema()
export class User {
    @Field(() => String)
    _id: Ms.Types.ObjectId;

    @Field(() => String)
    @Prop()
    login: string;

}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);