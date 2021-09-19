import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Schema as Ms } from 'mongoose';

import { Chat, ChatDocument } from './chat.model';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Lobby } from 'src/lobby/lobby.model';
import { AddMessageInput } from './chat.inputs';

@Resolver(() => Chat)
@UseGuards(JwtAuthGuard, RoleGuard)
export class ChatResolver {
    constructor(
		@Inject('PUB_SUB') private pubSub: PubSub,
		private readonly chatService: ChatService,
	) {}

    @Mutation(() => Chat)
    createChat(
        @Args('lobby_id', { type: () => String }) lobby_id: Ms.Types.ObjectId
    ){
        return this.chatService.create(lobby_id);
    }

    @Mutation(() => Chat)
    addMessage(
        @Args('AddMessageInput', { type: () => AddMessageInput }) payload: AddMessageInput
    ) {
        return this.chatService.addMessage(payload);
    }

    @Query(() => Chat)
    chat(
        @Args('id', { type: () => String }) id: Ms.Types.ObjectId
    ){
        return this.chatService.findOne(id);
    }

    @ResolveField()
    async lobby(
        @Parent() chat: ChatDocument
    ) {
        await chat.populate({ path: "lobby", model: Lobby.name })
        return chat.lobby;
    }
}
