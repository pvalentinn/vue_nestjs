import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as Ms } from 'mongoose';

import { Lobby, LobbyDocument } from './lobby.model';
import { User, UserDocument } from '../user/user.model';
import { ListLobbyInput, UpdateLobbyInput, AddPlayerLobbyInput } from './lobby.inputs';
import { Role } from 'src/role/role.decorator';
import { Chat, ChatDocument } from 'src/chat/chat.model';

@Injectable()
export class LobbyService {
    constructor(
        @InjectModel(Lobby.name) private lobbyModel: Model<LobbyDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Chat.name) private chatModel: Model<ChatDocument>
    ) {}

    async create(user_id: Ms.Types.ObjectId) {
        const createdLobby = new this.lobbyModel({ capacity: 8, players: [user_id] });

        const user = await this.userModel.findById(user_id).exec();
        user.lobby = createdLobby._id;
        user.roles = [...user.roles, Role.Owner];
        await user.save();

        const chat = await this.chatModel.create({ lobby: createdLobby._id });
        createdLobby.chat = chat._id;

        return { user, lobby: await createdLobby.save() }
    }

    async addPlayer(payload: AddPlayerLobbyInput) {
        const { id, player_id } = payload;

        try {
            let lobby = await this.lobbyModel.findById(id).exec();
            if(!lobby) return new UnauthorizedException("Cannot find lobby")
           

            let players = lobby.players as Array<Ms.Types.ObjectId>;
    
            if(lobby.players.length + 1 > lobby.capacity) return new UnauthorizedException("Lobby is full")
            if(players.find((e: Ms.Types.ObjectId) => player_id == e)) return new UnauthorizedException("Player already in lobby")

            let user = await this.userModel.findById(player_id).exec();
            if(!user) return new UnauthorizedException("Can't find player")

            user.lobby = lobby._id;
            await user.save();

            lobby.players.push(player_id);
            await lobby.save();
            return { user, lobby }
        } catch(e) {
            return new UnauthorizedException(e.message);
        }
    }

    async removePlayer(id: Ms.Types.ObjectId) {
        try {
            let user = await this.userModel.findById(id).exec();
            if(!user) return new UnauthorizedException("User not found!");

            let lobby = await this.lobbyModel.findById(user.lobby).exec();
            if(!lobby) return new UnauthorizedException("Lobby not found!");

            user.lobby = null;
            await user.save();

            lobby.players = lobby.players.filter((e) => e != user.id);
            if(user.roles.find(e => e == Role.Owner)) {
                user.roles = user.roles.filter(e => e!= Role.Owner);

                //IF NO PLAYERS[0] DESTROY LOBBY;
                if(!lobby.players.length) {
                    await lobby.remove();
                    return null;
                };

                let newOwner = await this.userModel.findById(lobby.players[0]).exec();
                if(!newOwner) return new UnauthorizedException("Could not proceed to add a new owner!");

                newOwner.roles = [...newOwner.roles, Role.Owner];
                await newOwner.save();
            }
            return await lobby.save();

        } catch(e) {
            return new UnauthorizedException(e.message);
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
