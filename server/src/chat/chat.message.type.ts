import { Field, ObjectType } from "@nestjs/graphql";
import { Schema } from "mongoose";

@ObjectType()
export class Message {
    @Field()
    id: number

    @Field(() => String)
    user_id: Schema.Types.ObjectId

    @Field(() => String)
    text: string

    @Field(() => Date, { defaultValue: new Date() })
    created_at: Date
}