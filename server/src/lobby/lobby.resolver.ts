import { Resolver, Query, Mutation, Args, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Schema as Ms } from 'mongoose';
import { Context, ContextType } from 'src/context.decorator';

import { LobbyService } from './lobby.service';
import { Lobby, LobbyDocument } from './lobby.model';
import { ListLobbyInput } from './lobby.inputs'
import { User, UserDocument } from 'src/user/user.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Role, Roles } from 'src/role/role.decorator';
import { AuthService } from 'src/auth/auth.service';
import { ChatService } from 'src/chat/chat.service';


@Resolver(() => Lobby)
export class LobbyResolver {
	constructor(
		@Inject('PUB_SUB') private pubSub: PubSub,
		private readonly lobbyService: LobbyService,
		private readonly chatService: ChatService,
		private readonly authService: AuthService,
	) {}

	@Mutation(() => Lobby)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(Role.User, Role.Admin)
	async createLobby(@Context(){ req }: ContextType) {
		let { user, lobby, chat } = await this.lobbyService.create(req.user.sub);

		let { access_token } = await this.authService.login(user);
		if(access_token) {
			req.res.setHeader('Set-Cookie', 'token=' + access_token + "; Path=/; Host");
		}

		await this.pubSub.publish('updateLobby', lobby);
		await this.pubSub.publish('updateChat', chat);
		return lobby
	}

	@Query(() => [Lobby], { name: 'lobbies' })
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(Role.Admin)
	findAll(@Args('filters', { nullable: true }) filters: ListLobbyInput ) {
		return this.lobbyService.list(filters);
	}

	@Query(() => Lobby, { name: 'lobby' })
	findOne(
		@Args('id', { type: () => String }) id: Ms.Types.ObjectId 
	) {
		let lobby = this.lobbyService.getById(id);
		if(!lobby) return new UnauthorizedException('Lobby not found');

		return lobby;
	}

	@Mutation(() => Lobby)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(Role.Owner, Role.Admin)
	removeLobby(@Args('id', { type: () => String }) id: Ms.Types.ObjectId) {
		return this.lobbyService.delete(id);
	}

	@UseGuards(JwtAuthGuard, RoleGuard)
	@Mutation(() => Lobby, { name: 'joinLobby' })
	async joinLobby(
		@Args('lobby_id', { type: () => String }) lobby_id: Ms.Types.ObjectId,
		@Context() { req }: ContextType 
	) {
		try {
			let { user, lobby } = await this.lobbyService.addPlayer({ player_id: req.user.sub, id: lobby_id }) as { user: UserDocument, lobby: LobbyDocument };
			let { access_token } = await this.authService.login(user);
			
			req.res.setHeader('Set-Cookie', 'token=' + access_token + "; Path=/;");
			await this.pubSub.publish('updateLobby', lobby);
			await this.pubSub.publish('updateChat', await this.chatService.findOneByLobby(lobby._id));

			return lobby;
		} catch(e: any) {
			console.log(e.message);
		}
	}

	@UseGuards(JwtAuthGuard, RoleGuard)
	@Mutation(() => Lobby, { name: 'leaveLobby', nullable: true })
	async leaveLobby(
		@Context() { req }: ContextType,
		@Args('id', { type: () => String, nullable: true }) id: Ms.Types.ObjectId
	) {
		try {
			
			if(id && !req.user.roles.filter((e) => e != Role.User).length) return new UnauthorizedException('You are not allowed to do that.');
			let target = id ? id : req.user.sub;

			let { lobby, chat }: any = await this.lobbyService.removePlayer(target);
			await this.pubSub.publish('updateLobby', lobby);
			await this.pubSub.publish('updateChat', chat);
		
			return lobby;

		} catch (e) {
			return null
		}
	}

	@Subscription(() => Lobby,
	{
		filter: (payload, variables) => payload._id == variables.id,
		resolve: (payload) => payload
	})
	updateLobby(
		@Args('id', { type: () => String }) id: Ms.Types.ObjectId,
	) {
		return this.pubSub.asyncIterator('updateLobby');
	}

	@ResolveField()
	async players(
		@Parent() lobby: LobbyDocument
	) {
		await lobby.populate({ path: 'players', model: User.name })
		return lobby.players
	}

	@ResolveField()
	async chat(
		@Parent() lobby: LobbyDocument
	) {
		await lobby.populate({ path: "chat", model: "Chat" });
		return lobby.chat;
	}
}
