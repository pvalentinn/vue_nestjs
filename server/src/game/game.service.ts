import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as Ms } from 'mongoose';
import { Lobby, LobbyDocument } from 'src/lobby/lobby.model';
import { Game, GameDocument } from './game.model';

@Injectable()
export class GameService {
    constructor(
       @InjectModel(Game.name) private gameModel: Model<GameDocument>,  
       @InjectModel(Lobby.name) private lobbyModel: Model<LobbyDocument>   
    ) {}

    async create(lobby_id: Ms.Types.ObjectId){
        try {

            let lobby = await this.lobbyModel.findById(lobby_id);
            if(!lobby) return new UnauthorizedException('Lobby not found');

            const game = new this.gameModel(lobby);
            console.log(game);
            return game;
            

        } catch(e: any) {
            return new UnauthorizedException(e.message);
        }
    }

    getByLobby(lobby_id: Ms.Types.ObjectId) {
        return this.gameModel.find({lobby_id}).exec();
    }
}
