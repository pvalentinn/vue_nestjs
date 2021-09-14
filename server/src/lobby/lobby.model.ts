import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as Ms } from 'mongoose';
import { User } from 'src/user/user.model';

@Schema()
export class Lobby {
    _id: Ms.Types.ObjectId;

    @Prop()
    capacity: number;

    @Prop({ type: [Ms.Types.ObjectId], ref: User.name })
    players: Ms.Types.ObjectId[];

}

export type LobbyDocument = Lobby & Document;
export const LobbySchema = SchemaFactory.createForClass(Lobby);