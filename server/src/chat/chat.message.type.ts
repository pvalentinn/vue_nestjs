import { Field, ObjectType } from "@nestjs/graphql";
import { Schema } from "mongoose";

@ObjectType()
export class Message {

    constructor(
        { id, user_id, text }: { id: number, user_id: Schema.Types.ObjectId | "server", text: string }
    ) {
        this.id = id;
        this.user_id = user_id;
        this.text = text;
        this.created_at = new Date();
    }

    @Field()
    id: number

    @Field(() => String)
    user_id: Schema.Types.ObjectId | "server"

    @Field(() => String)
    text: string

    @Field(() => Date, { defaultValue: new Date() })
    created_at: Date
}