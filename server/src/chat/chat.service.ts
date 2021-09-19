import { Injectable, BadRequestException, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as Ms } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role, Roles } from 'src/role/role.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { User, UserDocument } from 'src/user/user.model';
import { AddMessageInput } from './chat.inputs';
import { Message } from './chat.message.type';
import { Chat, ChatDocument } from './chat.model';

@Injectable()
@UseGuards(JwtAuthGuard, RoleGuard)
export class ChatService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    ){}

    async create(lobby_id: Ms.Types.ObjectId) {
        const chat = new this.chatModel({ lobby: lobby_id });
        return await chat.save();
    }

    @Roles(Role.Owner, Role.Admin)
    async findOne(id: Ms.Types.ObjectId){
        return await this.chatModel.findById(id).exec();
    }

    async addMessage(payload: AddMessageInput) {
        
        let chat: ChatDocument | null | undefined;
        let user: UserDocument | null | undefined;

        try {
            chat = await this.chatModel.findById(payload.id).exec();
            user = await this.userModel.findById(payload.user_id).exec();
        } catch (e) {
            if(!chat) return new BadRequestException("Couldn't find the chat");
            if(!user) return new BadRequestException("Couldn't find the user");
        }

        const message = new Message();
        message.id = chat.messages.length;
        message.text = payload.text;
        message.user_id = payload.user_id;
        message.created_at = new Date();

        chat.messages = [...chat.messages, message];
        return await chat.save();
    }
}
