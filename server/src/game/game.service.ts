import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as Ms, Types, Document } from 'mongoose';
import { Lobby, LobbyDocument } from 'src/lobby/lobby.model';
import { State, User, UserDocument } from 'src/user/user.model';
import { Card, Hand, Game, GameDocument } from './game.model';

@Injectable()
export class GameService {
    constructor(
       @InjectModel(Game.name) private gameModel: Model<GameDocument>,  
       @InjectModel(Lobby.name) private lobbyModel: Model<LobbyDocument>,
       @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async create(lobby_id: Ms.Types.ObjectId){
        try {

            let lobby = await this.lobbyModel.findById(lobby_id);
            if(!lobby) return new UnauthorizedException('Lobby not found');
            
            const game = new this.gameModel();
            game.lobby_id = lobby._id;
            game.deck = this.createDeck();

            game.hands = [];
            for(const player_id of lobby.players) {
                let player = await this.userModel.findById(player_id);
                if(!player) return new UnauthorizedException('Player with id' + player_id + ' not found');
                player.state = State.IN_GAME;
                await player.save();
                
                let hand = new Hand();
                hand.user_id = player_id;
                hand.user_login = player.login;
    
                let cards: Card[] = [];
                for(let i = 0; i < 7; i++) {
                    cards.push(game.deck.shift());
                }

                hand.cards = cards;
                hand.left = cards.length;
                game.hands.push(hand);
            }
            game.pile = game.deck.reduce((value: Card[], card: Card) => {
                if(!value.length || value[value.length - 1].color == 'black') {
                    game.deck.shift();
                    return [...value, card];
                } else return value;
            }, [])
    
            game.current_color = game.pile[game.pile.length - 1].color;
            game.turn = {
                direction: 1,
                user_id: game.hands[Math.floor(Math.random() * game.hands.length)].user_id
            };
            await game.save();

            return { lobby, game };
        } catch(e: any) {
            console.log(e.message);
            return new UnauthorizedException(e.message);
        }
    }

    async getByLobby(lobby_id: Ms.Types.ObjectId, user_id: Ms.Types.ObjectId) {
        let game = await this.gameModel.findOne({lobby_id}).exec();
        if(!game) return new UnauthorizedException('No game find.');

        game.hands = game.hands.map((hand) => {
            let newHand = hand;
            if(newHand.user_id != user_id) newHand.cards = null;
            return newHand;
        })
        return game;
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

    async draw(game: Game & Document & { _id: any; }, n: number){
        try {
            let { user_id } = game.turn;
            let hand = game.hands.indexOf(game.hands.find(hand => {
                let a = hand.user_id as unknown as Types.ObjectId;
                let b = user_id as unknown as Types.ObjectId;
                return a.equals(b)
            }));

            for(let i = 0; i < n; i++) {
                if(!game.deck.length) game.deck = this.createDeck();
                game.hands[hand].cards.push(game.deck.shift());
            }

            return game;

        } catch(e: any){
            console.error(e.message);
            throw new Error(e.message);
        }
    }

    async passTurn(game: Game & Document & { _id: any; }) {
        try {
            let { user_id, direction } = game.turn;
            let hand = game.hands.indexOf(game.hands.find(hand => {
                let a = hand.user_id as unknown as Types.ObjectId;
                let b = user_id as unknown as Types.ObjectId;
                return a.equals(b)
            }));

            let turn = hand + direction;

            if(turn < 0) turn = game.hands.length - 1;
            else if(turn == game.hands.length) turn = 0;
            
            game.turn.user_id = game.hands[turn].user_id;
            return game;

        } catch(e: any){
            console.error(e.message);
            throw new Error(e.message);
        }
    }

    async changeTurnDirection(game: Game & Document & { _id: any; }) {
        try {
            let { direction } = game.turn;
            game.turn.direction = direction ? -1 : 1;

            return await this.passTurn(game);

        } catch(e: any){
            console.error(e.message);
            throw new Error(e.message);
        }
    }

    async playCard(lobby_id: Ms.Types.ObjectId, index: number) {
        try {
            let game = await this.gameModel.findOne({lobby_id}).exec();
            if(!game) return new UnauthorizedException('No game find.');


            let { user_id } = game.turn;
            let hand = game.hands.indexOf(game.hands.find(hand => {
                let a = hand.user_id as unknown as Types.ObjectId;
                let b = user_id as unknown as Types.ObjectId;
                return a.equals(b)
            }));
            let card = game.hands[hand].cards.splice(index, 1)[0];
            // console.log(game.hands[hand].cards);

            game.pile.push(card);
            game.current_color = card.color;

            console.log(game.hands[hand].cards);

            switch(card.value) {
                case "reverse":
                    await this.changeTurnDirection(game);
                break;
                case "skip":
                    await this.passTurn(game);
                    await this.passTurn(game);
                break;
                case "draw2":
                    await this.passTurn(game);

                    hand = game.hands.indexOf(game.hands.find(hand => hand.user_id == game.turn.user_id));
                    if(!game.hands[hand].cards.find(card => card.value == 'draw2')) {
                        await this.draw(game, 2);
                        await this.passTurn(game);
                    }
                break;
                case "draw4":
                    await this.passTurn(game);

                    hand = game.hands.indexOf(game.hands.find(hand => hand.user_id == game.turn.user_id));
                    if(!game.hands[hand].cards.find(card => card.value == 'draw4')) {
                        await this.draw(game, 4);
                        await this.passTurn(game);
                    }
                break;
                default:
                    // console.log(game.hands[hand].cards, game.turn);
                    await this.passTurn(game);
                    // console.log(game.hands[hand].cards, game.turn);
                break;
            }

            // console.log(game.hands[hand].cards);
            await game.updateOne(game);
            return game;

        } catch(e: any){
            console.error(e.message);
            throw new Error(e.message);
        }
    }

}
