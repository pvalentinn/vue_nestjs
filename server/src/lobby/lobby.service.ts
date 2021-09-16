import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as Ms } from 'mongoose';

import { Lobby, LobbyDocument } from './lobby.model';
import { User, UserDocument } from '../user/user.model';
import { CreateLobbyInput, ListLobbyInput, UpdateLobbyInput, AddPlayerLobbyInput } from './lobby.inputs';

@Injectable()
export class LobbyService {
    constructor(
        @InjectModel(Lobby.name) private lobbyModel: Model<LobbyDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async create(payload: CreateLobbyInput) {
        const createdLobby = new this.lobbyModel(payload);
        const user = await this.userModel.findById(payload.players[0]).exec();

        user.lobby = createdLobby._id;
        await user.save();
        return await createdLobby.save();
    }

    async addPlayer(payload: AddPlayerLobbyInput) {
        const { id, player_id } = payload;

        try {
            let lobby = await this.lobbyModel.findById(id).exec();
            if(!lobby) return { error: true, message: "Cannot find lobby" }

            let players = lobby.players as Array<Ms.Types.ObjectId>;
    
            if(lobby.players.length + 1 > lobby.capacity) return { error: true, message: "Lobby is full" }
            if(players.find((e: Ms.Types.ObjectId) => player_id == e)) return { error: true, message: "Player already in lobby" }

            let user = await this.userModel.findById(player_id).exec();
            if(!user) return { error: true, message: "Cannot find player"  }

            //@ts-ignore
            lobby.players.push(player_id);
            return {
                error: false,
                result: lobby.save()
            };
        } catch(e) {
            console.log(e)
            return { error: true, message: e.message };
        }
    }

    getById(_id: Ms.Types.ObjectId) {
        return this.lobbyModel.findById(_id).exec();
    }

    list(filters: ListLobbyInput) {
        return this.lobbyModel.find({ ...filters }).exec();
    }

    update(payload: UpdateLobbyInput) {
        return this.lobbyModel
        .findByIdAndUpdate(payload._id, payload, { new: true })
        .exec();
    }

    delete(_id: Ms.Types.ObjectId) {
        return this.lobbyModel.findByIdAndDelete(_id).exec();
    }
    
}
