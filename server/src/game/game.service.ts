import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as Ms } from 'mongoose';
import { Lobby, LobbyDocument } from 'src/lobby/lobby.model';
import { State, User, UserDocument } from 'src/user/user.model';
import { Game, GameDocument } from './game.model';

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

            for(const player_id of lobby.players) {
                let player = await this.userModel.findById(player_id);
                if(!player) return new UnauthorizedException('Player with id' + player_id + ' not found');
                player.state = State.IN_GAME;
                await player.save();
            }

            const game = new Game(lobby);
            await this.gameModel.create(game);
            return { lobby, game };

        } catch(e: any) {
            console.log(e.message);
            return new UnauthorizedException(e.message);
        }
    }

    getByLobby(lobby_id: Ms.Types.ObjectId) {
        return this.gameModel.find({lobby_id}).exec();
    }
}
