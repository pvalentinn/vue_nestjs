import { Args, Query, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Schema as Ms, Types } from 'mongoose';
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
    async playCard(
        @Args('index') i: number,
        @Context() { req }: ContextType
    ) {
        let game = await this.gameService.playCard(req.user.lobby, i);
        await this.pubSub.publish('updateGame', game);
        return game;
    }

    @Subscription(() => Game,
	{
		filter: (payload, variables) => payload.lobby_id == variables.id,
		resolve: (payload, args) => {
            // payload.hands = payload.hands.map((hand) => {
            //     let a = hand.user_id as unknown as Types.ObjectId;
            //     let b = args.user_id as unknown as Types.ObjectId;
            //     let newHand = hand;
            //     if(!a.equals(b)) newHand.cards = null;
            //     return newHand;
            // })

            return payload;
        }
	})
	updateGame(
		@Args('id', { type: () => String }) id: Ms.Types.ObjectId,
		@Args('user_id', { type: () => String }) user_id: Ms.Types.ObjectId
	) {
		return this.pubSub.asyncIterator('updateGame');
	}
}
