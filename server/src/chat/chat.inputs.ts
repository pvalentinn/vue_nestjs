import { Schema as Ms } from 'mongoose';
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AddMessageInput {
    @Field(() => String)
    lobby_id: Ms.Types.ObjectId

    @Field()
    text: string
} 