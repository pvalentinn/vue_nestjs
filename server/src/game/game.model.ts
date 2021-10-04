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

    @Field(() => [Card])
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
@Schema({ timestamps: true })
export class Game {
    constructor(lobby: Lobby) {
        this.lobby_id = lobby._id;
        this.deck = this.createDeck();
        this.hands = lobby.players.map((user_id) => {
            let hand = new Hand();
            hand.user_id = user_id;

            let cards: Card[] = [];
            for(let i = 0; i < 7; i++) {
                cards.push(this.deck.shift());
            }
            hand.cards = cards;
            return hand;
        })

        this.pile = this.deck.reduce((value: Card[], card: Card) => {
            if(!value.length || value[value.length - 1].color == 'black') {
                this.deck.shift();
                return [...value, card];
            } else return value;
        }, [])

        this.current_color = this.pile[this.pile.length - 1].color;
        this.turn = this.hands[Math.floor(Math.random() * this.hands.length)];
    }

    createDeck() {
        let deck: Card[] = [];
        let colors = ["red", "blue", "green", "yellow"];

        colors.forEach(color => {
            let zero = new Card(color, '0');
            deck.push(zero);

            for(let i = 1; i <= 9; i++) {
                deck.push(new Card(color, i.toString()));
                deck.push(new Card(color, i.toString()));
            }

            for(let i = 0; i < 3; i++) {
                let value: string;
                if(i == 0) value = "draw2";
                if(i == 1) value = "reverse";
                if(i == 2) value = "skip";

                deck.push(new Card(color, value));
                deck.push(new Card(color, value));
            }
        })

        for(let i = 0; i < 2; i++) {
            let value: string;
            if(i == 0) value = "draw4";
            if(i == 1) value = "color";

            for(let j = 0; j < 4; j++) deck.push(new Card('black', value));
        }

        deck.sort(() => Math.random() - 0.5);
        deck.reverse();
        deck.sort(() => Math.random() - 0.5);
        return deck;
    }

    @Field(() => String)
    @Prop({ type: Ms.Types.ObjectId, ref: Lobby.name })
    lobby_id: Ms.Types.ObjectId;

    @Field(() => [Hand])
    hands: Hand[];

    @Field(() => [Card])
    deck: Card[];

    @Field(() => [Card], { nullable: true })
    pile: Card[];

    @Field(() => Hand)
    turn: Hand;

    @Field(() => String)
    current_color: String
}

export type GameDocument = Game & Document;
export const GameSchema = SchemaFactory.createForClass(Game);