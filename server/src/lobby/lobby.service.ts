import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as Ms } from 'mongoose';

import { Lobby, LobbyDocument } from './lobby.model';
import { CreateLobbyInput, ListLobbyInput, UpdateLobbyInput } from './lobby.inputs';

@Injectable()
export class LobbyService {
    constructor(
        @InjectModel(Lobby.name) private lobbyModel: Model<LobbyDocument>
    ) {}

    create(payload: CreateLobbyInput) {
        const createdLobby = new this.lobbyModel(payload);
        return createdLobby.save();
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
