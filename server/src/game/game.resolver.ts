import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Schema as Ms } from 'mongoose';
import { GameService } from './game.service';
import { PubSub } from 'graphql-subscriptions';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Roles, Role } from 'src/role/role.decorator';
import { Game } from './game.model';

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
        return this.gameService.create(lobby_id);
    }
}
