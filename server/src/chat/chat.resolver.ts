import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Schema as Ms } from 'mongoose';

import { Chat, ChatDocument } from './chat.model';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Lobby } from 'src/lobby/lobby.model';
import { AddMessageInput } from './chat.inputs';
import { Context, ContextType } from 'src/context.decorator';

@Resolver(() => Chat)
export class ChatResolver {
    constructor(
		@Inject('PUB_SUB') private pubSub: PubSub,
		private readonly chatService: ChatService,
	) {}

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Mutation(() => Chat)
    async addMessage(
        @Args('AddMessageInput', { type: () => AddMessageInput }) payload: AddMessageInput,
        @Context() { req }: ContextType
    ) {
        let chat = await this.chatService.addMessage({...payload, user_id: req.user.sub});
        await this.pubSub.publish('updateChat', chat);
        return chat;
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Query(() => Chat)
    chat(
        @Args('lobby_id', { type: () => String }) lobby_id: Ms.Types.ObjectId,
    ){
        return this.chatService.findOneByLobby(lobby_id);
    }

    @Subscription(() => Chat, {
        filter: (payload, variables) =>  payload.lobby = variables.lobby_id,
        resolve: (payload) => payload
    })
    updateChat(
        @Args('lobby_id', { type: () => String }) lobby_id: Ms.Types.ObjectId
    ) {
        return this.pubSub.asyncIterator('updateChat')
    }

    @ResolveField()
    async lobby(
        @Parent() chat: ChatDocument
    ) {
        await chat.populate({ path: "lobby", model: Lobby.name })
        return chat.lobby;
    }
}
