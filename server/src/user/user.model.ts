import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as Ms } from 'mongoose';
import { Lobby } from 'src/lobby/lobby.model';

@ObjectType()
@Schema()
export class User {
    @Field(() => String)
    _id: Ms.Types.ObjectId;

    @Field(() => String)
    @Prop()
    login: string;

    @Field(() => Lobby)
    @Prop({ type: Ms.Types.ObjectId, ref: 'Lobby' })
    lobby: Ms.Types.ObjectId;

}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);