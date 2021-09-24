import { Field, ObjectType } from "@nestjs/graphql";
import { Schema } from "mongoose";

@ObjectType()
export class Message {

    constructor(
        { id, sender_id, text, sender }: { id: number, sender_id?: Schema.Types.ObjectId, sender: string | "server", text: string }
    ) {
        this.id = id;
        this.sender_id = sender_id && sender_id;
        this.sender = sender;
        this.text = text;
        this.created_at = new Date();
    }

    @Field()
    id: number

    @Field(() => String, { nullable: true })
    sender_id?: Schema.Types.ObjectId

    @Field(() => String)
    sender: string | "server"

    @Field(() => String)
    text: string

    @Field(() => Date, { defaultValue: new Date() })
    created_at: Date
}