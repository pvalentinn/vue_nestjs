import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as Ms } from 'mongoose';
import { Lobby } from 'src/lobby/lobby.model';
import { Message } from './chat.message.type';

@ObjectType()
@Schema({ timestamps: true })
export class Chat {
    _id: Ms.Types.ObjectId;

    @Field(() => Lobby)
    @Prop({ type: Ms.Types.ObjectId, ref: 'Lobby' })
    lobby: Ms.Types.ObjectId;

    @Field(() => [Message])
    @Prop()
    messages: Message[];
}

export type ChatDocument = Chat & Document;
export const ChatSchema = SchemaFactory.createForClass(Chat);