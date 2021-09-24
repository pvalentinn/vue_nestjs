import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as Ms } from 'mongoose';
import { Lobby } from 'src/lobby/lobby.model';
import { Role } from 'src/role/role.decorator';

export enum State {
    UNREADY = "unready",
    READY = "ready",
    IN_GAME = "in_game"
};

registerEnumType(State, { name: "UserState" });

@ObjectType()
@Schema({ timestamps: true })
export class User {
    @Field(() => String)
    _id: Ms.Types.ObjectId;

    @Field(() => String)
    @Prop()
    login: string;

    @Field(() => State, { defaultValue: State.UNREADY })
    @Prop({ default: State.UNREADY })
    state: State;

    @Field(() => Lobby, { nullable: true })
    @Prop({ type: Ms.Types.ObjectId, ref: 'Lobby' })
    lobby: Ms.Types.ObjectId;

    @Field(() => [Role])
    @Prop({ default: [Role.User] })
    roles: Role[]
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);