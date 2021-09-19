import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as Ms } from 'mongoose';
import { Lobby } from 'src/lobby/lobby.model';
import { Role } from 'src/role/role.decorator';

@ObjectType()
@Schema({ timestamps: true })
export class User {
    @Field(() => String)
    _id: Ms.Types.ObjectId;

    @Field(() => String)
    @Prop()
    login: string;

    @Field(() => Lobby, { nullable: true })
    @Prop({ type: Ms.Types.ObjectId, ref: 'Lobby' })
    lobby: Ms.Types.ObjectId;

    @Prop({ default: [Role.User] })
    roles: Role[]
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);