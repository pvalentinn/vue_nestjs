import { Resolver, Query, Mutation, Args, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Inject, UseGuards } from '@nestjs/common';
import { Schema as Ms } from 'mongoose';
import { Context, ContextType } from 'src/context.decorator';

import { LobbyService } from './lobby.service';
import { Lobby, LobbyDocument } from './lobby.model';
import { ListLobbyInput, UpdateLobbyInput } from './lobby.inputs'
import { User, UserDocument } from 'src/user/user.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Role, Roles } from 'src/role/role.decorator';
import { AuthService } from 'src/auth/auth.service';


@Resolver(() => Lobby)
export class LobbyResolver {
	constructor(
		@Inject('PUB_SUB') private pubSub: PubSub,
		private readonly lobbyService: LobbyService,
		private readonly authService: AuthService,
	) {}

	@Mutation(() => Lobby)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(Role.User, Role.Admin)
	async createLobby(@Context(){ req }: ContextType) {
		let { user, lobby } = await this.lobbyService.create(req.user.sub);

		let { access_token } = await this.authService.login(user);
		if(access_token) {
			req.res.setHeader('Set-Cookie', 'token=' + access_token + "; Path=/;");
		}

		return lobby
	}

	@Query(() => [Lobby], { name: 'lobbies' })
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(Role.Admin)
	findAll(@Args('filters', { nullable: true }) filters: ListLobbyInput ) {
		return this.lobbyService.list(filters);
	}

	@Query(() => Lobby, { name: 'lobby' })
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(Role.User, Role.Admin)
	findOne(@Args('id', { type: () => String }) id: Ms.Types.ObjectId ) {
		return this.lobbyService.getById(id);
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

			return lobby;
		} catch(e: any) {
			console.log(e.message);
		}
	}

	@UseGuards(JwtAuthGuard, RoleGuard)
	@Mutation(() => Lobby, { name: 'leaveLobby' })
	async leaveLobby(
		@Context() { req }: ContextType 
	) {
		let lobby = await this.lobbyService.removePlayer(req.user.sub);
		this.pubSub.publish('updateLobby', lobby);
	
		return lobby;
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
