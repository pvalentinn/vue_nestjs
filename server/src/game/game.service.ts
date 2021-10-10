import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as Ms, Types } from 'mongoose';
import { PayloadType } from 'src/auth/jwt.payload';
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

    async draw(game: GameDocument, n: number){
        try {
            let { user_id } = game.turn;
            let hand = game.hands.indexOf(game.hands.find(hand => hand.user_id == user_id));

            for(let i = 0; i < n; i++) {
                if(!game.deck.length) game.deck = this.createDeck();
                game.hands[hand].cards.push(game.deck.shift());
            }

            return await game.save();

        } catch(e: any){
            console.error(e.message);
            throw new Error(e.message);
        }
    }

    async passTurn(game: GameDocument) {
        try {
            let { user_id, direction } = game.turn;
            let hand = game.hands.indexOf(game.hands.find(hand => hand.user_id == user_id));

            let turn = hand + direction;
            console.log(turn);

            if(turn < 0) turn = game.hands.length - 1;
            else if(turn == game.hands.length) turn = 0;

            return await game.save();

        } catch(e: any){
            console.error(e.message);
            throw new Error(e.message);
        }
    }

    async changeTurnDirection(game: GameDocument) {
        try {
            let { direction } = game.turn;
            game.turn.direction = direction ? -1 : 1;

            return await this.passTurn(await game.save());

        } catch(e: any){
            console.error(e.message);
            throw new Error(e.message);
        }
    }

    async playCard(game: GameDocument, index: number) {
        try {

            let { user_id } = game.turn;
            let hand = game.hands.indexOf(game.hands.find(hand => {
                let a = hand.user_id as unknown as Types.ObjectId;
                let b = user_id as unknown as Types.ObjectId;
                return a.equals(b)
            }));
            let card = game.hands[hand].cards.splice(index, 1)[0];
            console.log(card);

            game.pile.push(card);
            game.current_color = card.color;

            switch(card.value) {
                case "reverse":
                    game = await this.changeTurnDirection(await game.save());
                break;
                case "skip":
                    game = await this.passTurn(await game.save());
                    game = await this.passTurn(game);
                break;
                case "draw2":
                    game = await this.passTurn(await game.save());

                    hand = game.hands.indexOf(game.hands.find(hand => hand.user_id == game.turn.user_id));
                    if(!game.hands[hand].cards.find(card => card.value == 'draw2')) {
                        game = await this.draw(game, 2);
                        game = await this.passTurn(game);
                    }
                break;
                case "draw4":
                    game = await this.passTurn(await game.save());

                    hand = game.hands.indexOf(game.hands.find(hand => hand.user_id == game.turn.user_id));
                    if(!game.hands[hand].cards.find(card => card.value == 'draw4')) {
                        game = await this.draw(game, 4);
                        game = await this.passTurn(game);
                    }
                break;
                default:
                break;
            }


            return game.save();

        } catch(e: any){
            console.error(e.message);
            throw new Error(e.message);
        }
    }

}
