import { Resolver, Query, Mutation, Args, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Inject, UseGuards } from '@nestjs/common';
import { Schema as Ms } from 'mongoose';
import { Context, ContextType } from 'src/context.decorator';

import { LobbyService } from './lobby.service';
import { Lobby, LobbyDocument } from './lobby.model';
import { AddPlayerReturn, ListLobbyInput, UpdateLobbyInput } from './lobby.inputs'
import { User } from 'src/user/user.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Role, Roles } from 'src/role/role.decorator';


@Resolver(() => Lobby)
@UseGuards(JwtAuthGuard, RoleGuard)
export class LobbyResolver {
	constructor(
		@Inject('PUB_SUB') private pubSub: PubSub,
		private readonly lobbyService: LobbyService,
	) {}

	@Mutation(() => Lobby)
	@Roles(Role.User, Role.Admin)
	createLobby(@Context(){ req }: ContextType) {
		return this.lobbyService.create(req.user.sub);
	}

	@Query(() => [Lobby], { name: 'lobbies' })
	@Roles(Role.Admin)
	findAll(@Args('filters', { nullable: true }) filters: ListLobbyInput ) {
		return this.lobbyService.list(filters);
	}

	@Query(() => Lobby, { name: 'lobby' })
	@Roles(Role.User, Role.Admin)
	findOne(@Args('id', { type: () => String }) id: Ms.Types.ObjectId ) {
		return this.lobbyService.getById(id);
	}

	@Mutation(() => Lobby)
	@Roles(Role.Owner, Role.Admin)
	updateLobby(@Args('updateLobbyInput') updateLobbyInput: UpdateLobbyInput) {
		return this.lobbyService.update(updateLobbyInput);
	}

	@Mutation(() => Lobby)
	@Roles(Role.Owner, Role.Admin)
	removeLobby(@Args('id', { type: () => String }) id: Ms.Types.ObjectId) {
		return this.lobbyService.delete(id);
	}

	@Mutation(() => AddPlayerReturn, { name: 'addPlayer' })
	async addPlayer(
		@Args('lobby_id', { type: () => String }) lobby_id: Ms.Types.ObjectId,
		@Context() { req }: ContextType 
	) {
		let res = await this.lobbyService.addPlayer({ player_id: req.user.sub, id: lobby_id });
		if(!res.error) {
			this.pubSub.publish('updatePlayers', await res.result);
		}
		return res;
	}

	@Subscription(() => Lobby,
	{
		filter: (payload, variables) => payload._id == variables.id,
		resolve: (payload) => payload
	})
	updatePlayers(@Args('id', { type: () => String }) id: Ms.Types.ObjectId) {
		return this.pubSub.asyncIterator('updatePlayers');
	}

	@ResolveField()
	async players(
		@Parent() lobby: LobbyDocument
	) {
		await lobby.populate({ path: 'players', model: User.name })
		return lobby.players
	}
}
