import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Schema as Ms } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';

import { GameService } from './game.service';
import { Game, GameDocument } from './game.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Roles, Role } from 'src/role/role.decorator';
import { LobbyDocument } from 'src/lobby/lobby.model';

@Resolver()
export class GameResolver {
    constructor(
        @Inject('PUB_SUB') private pubSub: PubSub,
        private readonly gameService: GameService
    ) {}

    @Mutation(() => Game)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.Owner)
    async createGame( 
        @Args('lobby_id', { type: () => String }) lobby_id: Ms.Types.ObjectId
    ) {
        let { lobby, game } = await this.gameService.create(lobby_id) as { game: GameDocument, lobby: LobbyDocument };
        this.pubSub.publish('updateLobby', lobby);
        return game;
    }

    @Query(() => Game, { name: 'game' })
    @UseGuards(JwtAuthGuard)
    getGame(
        @Args('lobby_id', { type: () => String }) lobby_id: Ms.Types.ObjectId
    ) {
        return this.gameService.getByLobby(lobby_id);
    }
}
