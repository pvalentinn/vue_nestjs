import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as Ms } from 'mongoose';
import { Chat } from 'src/chat/chat.model';
import { User } from 'src/user/user.model';

@ObjectType()
@Schema({ timestamps: true })
export class Lobby {
    @Field(() => String)
    _id: Ms.Types.ObjectId;

    @Field(() => Number)
    @Prop()
    capacity: number;

    @Field(() => [User])
    @Prop({ type: [Ms.Types.ObjectId], ref: 'User' })
    players: Ms.Types.ObjectId[];

    @Field(() => Chat)
    @Prop({ type: Ms.Types.ObjectId, ref: 'Chat', default: new Chat() })
    chat: Ms.Types.ObjectId;
}

export type LobbyDocument = Lobby & Document;
export const LobbySchema = SchemaFactory.createForClass(Lobby);