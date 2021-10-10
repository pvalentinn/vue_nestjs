import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as Ms } from 'mongoose';
import { Lobby } from 'src/lobby/lobby.model';
import { User } from 'src/user/user.model';

@ObjectType()
export class Hand {
    @Field(() => String)
    @Prop({ type: Ms.Types.ObjectId, ref: User.name })
    user_id: Ms.Types.ObjectId;

    @Field(() => String)
    @Prop()
    user_login: string;

    @Field(() => Number)
    @Prop()
    left: number

    @Field(() => [Card], { nullable: true })
    @Prop()
    cards: Card[]
}

@ObjectType()
export class Card {
    constructor(color: string, value: string) {
        this.color = color;
        this.value = value;
    }

    @Field(() => String)
    color: string;

    @Field(() => String)
    value: string;
}

@ObjectType()
export class Turn {
    @Field(() => String)
    user_id: Ms.Types.ObjectId

    @Field()
    direction: -1 | 1
}


@ObjectType()
@Schema({ timestamps: true })
export class Game {
    @Field(() => String)
    @Prop({ type: Ms.Types.ObjectId, ref: Lobby.name })
    lobby_id: Ms.Types.ObjectId;

    @Field(() => [Hand])
    @Prop()
    hands: Hand[];

    @Prop()
    deck: Card[];

    @Field(() => [Card])
    @Prop()
    pile: Card[];

    @Field(() => Turn)
    @Prop()
    turn: Turn;

    @Field(() => String)
    @Prop()
    current_color: String
}

export type GameDocument = Game & Document;
export const GameSchema = SchemaFactory.createForClass(Game);