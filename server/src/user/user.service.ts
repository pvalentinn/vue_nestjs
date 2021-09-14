import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as Ms } from 'mongoose';

import { User, UserDocument } from './user.model';
import { CreateUserInput, ListUserInput, UpdateUserInput } from './user.inputs';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    create(payload: CreateUserInput) {
        const createdUser = new this.userModel(payload);
        return createdUser.save();
    }

    getById(_id: Ms.Types.ObjectId) {
        return this.userModel.findById(_id).exec();
    }

    list(filters: ListUserInput) {
        return this.userModel.find({ ...filters }).exec();
    }

    update(payload: UpdateUserInput) {
        return this.userModel
        .findByIdAndUpdate(payload._id, payload, { new: true })
        .exec();
    }

    delete(_id: Ms.Types.ObjectId) {
        return this.userModel.findByIdAndDelete(_id).exec();
    }
    
}
