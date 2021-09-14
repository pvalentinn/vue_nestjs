import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Schema as Ms } from 'mongoose';

import { LobbyService } from './lobby.service';
import { Lobby, LobbyDocument } from './lobby.model';
import { CreateLobbyInput, ListLobbyInput, UpdateLobbyInput } from './lobby.inputs'
import { User } from 'src/user/user.model';

@Resolver(() => Lobby)
export class LobbyResolver {
	constructor(private readonly lobbyService: LobbyService) {}

	@Mutation(() => Lobby)
	createLobby(@Args('createLobbyInput') createLobbyInput: CreateLobbyInput) {
		return this.lobbyService.create(createLobbyInput);
	}

	@Query(() => [Lobby], { name: 'lobbies' })
	findAll(@Args('filters', { nullable: true }) filters: ListLobbyInput ) {
		return this.lobbyService.list(filters);
	}

	@Query(() => Lobby, { name: 'lobby' })
	findOne(@Args('id', { type: () => String }) id: Ms.Types.ObjectId ) {
		return this.lobbyService.getById(id);
	}

	@Mutation(() => Lobby)
	updateLobby(@Args('updateLobbyInput') updateLobbyInput: UpdateLobbyInput) {
		return this.lobbyService.update(updateLobbyInput);
	}

	@Mutation(() => Lobby)
	removeLobby(@Args('id', { type: () => String }) id: Ms.Types.ObjectId) {
		return this.lobbyService.delete(id);
	}

	@ResolveField()
	async players(
		@Parent() lobby: LobbyDocument
	) {
		await lobby.populate({ path: 'players', model: User.name })
		return lobby.players
	}
}
