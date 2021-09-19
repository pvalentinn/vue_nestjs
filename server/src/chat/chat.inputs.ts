import { Schema as Ms } from 'mongoose';
import { Field, InputType } from "@nestjs/graphql";
import { Message } from './chat.message.type';

@InputType()
export class AddMessageInput {
    @Field(() => String)
    id: Ms.Types.ObjectId

    @Field(() => String)
    user_id: Ms.Types.ObjectId

    @Field()
    text: string
} 