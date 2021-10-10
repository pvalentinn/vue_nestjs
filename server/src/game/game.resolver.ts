import { Args, Query, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Schema as Ms } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';

import { GameService } from './game.service';
import { Game, GameDocument } from './game.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Roles, Role } from 'src/role/role.decorator';
import { LobbyDocument } from 'src/lobby/lobby.model';
import { Context, ContextType } from 'src/context.decorator';

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
        @Context() { req }: ContextType
    ) {
        let { lobby, game } = await this.gameService.create(req.user.lobby) as { game: GameDocument, lobby: LobbyDocument };
        this.pubSub.publish('updateLobby', lobby);
        return game;
    }

    @Query(() => Game, { name: 'game' })
    @UseGuards(JwtAuthGuard)
    getGame(
        @Context() { req }: ContextType
    ) {
        return this.gameService.getByLobby(req.user.lobby, req.user.sub);
    }

    @Mutation(() => Game)
    @UseGuards(JwtAuthGuard)
    async draw( 
        @Args('number') n: number,
        @Context() { req }: ContextType
    ) {
        let game = await this.gameService.getByLobby(req.user.lobby, req.user.sub);
        return await this.gameService.draw(game as GameDocument, n);
    }

    @Mutation(() => Game)
    @UseGuards(JwtAuthGuard)
    async passTurn( 
        @Context() { req }: ContextType
    ) {
        let game = await this.gameService.getByLobby(req.user.lobby, req.user.sub);
        return await this.gameService.passTurn(game as GameDocument);
    }

    @Mutation(() => Game)
    @UseGuards(JwtAuthGuard)
    async changeTurn( 
        @Context() { req }: ContextType
    ) {
        let game = await this.gameService.getByLobby(req.user.lobby, req.user.sub);
        return await this.gameService.changeTurnDirection(game as GameDocument);
    }

    @Mutation(() => Game)
    @UseGuards(JwtAuthGuard)
    async playCard(
        @Args('index') i: number,
        @Context() { req }: ContextType
    ) {
        let game = await this.gameService.playCard(await this.gameService.getByLobby(req.user.lobby, req.user.sub) as GameDocument, i);
        await this.pubSub.publish('updateGame', game);
        return game;
    }

    @Subscription(() => Game,
	{
		filter: (payload, variables) => payload.lobby_id == variables.id,
		resolve: (payload) => payload
	})
	updateGame(
		@Args('id', { type: () => String }) id: Ms.Types.ObjectId,
	) {
		return this.pubSub.asyncIterator('updateGame');
	}
}
