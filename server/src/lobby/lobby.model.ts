import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as Ms } from 'mongoose';
import { User } from 'src/user/user.model';

@ObjectType()
@Schema()
export class Lobby {
    @Field(() => String)
    _id: Ms.Types.ObjectId;

    @Field(() => Number)
    @Prop()
    capacity: number;

    @Field(() => [User])
    @Prop({ type: [Ms.Types.ObjectId], ref: 'User' })
    players: Ms.Types.ObjectId[] | User[];

}

export type LobbyDocument = Lobby & Document;
export const LobbySchema = SchemaFactory.createForClass(Lobby);