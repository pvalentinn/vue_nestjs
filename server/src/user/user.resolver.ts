import { Resolver, Query, Mutation, Args, Parent, ResolveField, Subscription } from '@nestjs/graphql';
import { Inject, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { Schema as Ms } from 'mongoose';

import { UserService } from './user.service';
import { User, UserDocument } from './user.model';
import { CreateUserInput, ListUserInput, UpdateUserInput } from './user.inputs'
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Context, ContextType } from 'src/context.decorator';
import { Role, Roles } from 'src/role/role.decorator';
import { RoleGuard } from 'src/role/role.guard';


@Resolver(() => User)
export class UserResolver {
	constructor(
		@Inject('PUB_SUB') private pubSub: PubSub,
		private readonly userService: UserService,
		private authService: AuthService
	) {}

	@Mutation(() => User)
	async createUser(
		@Args('createUserInput') createUserInput: CreateUserInput,
		@Context() { req }: ContextType
		) {
		let user = await this.userService.create(createUserInput);
		let { access_token } = await this.authService.login(user);
		if(access_token) {
			req.res.setHeader('Set-Cookie', 'token=' + access_token + "; Path=/;");
			
			return user;
		} else {
			throw new UnauthorizedException();
		}
	}

	@Query(() => User, { name: 'me' })
	@UseGuards(JwtAuthGuard)
	me(@Context() { req }: ContextType ) {
		return this.userService.getById(req.user.sub);
	}

	@Query(() => [User], { name: 'users' })
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(Role.Admin)
	findAll(@Args('filters', { nullable: true }) filters: ListUserInput ) {
		return this.userService.list(filters);
	}

	@Query(() => User, { name: 'user' })
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(Role.Admin)
	findOne(@Args('id', { type: () => String }) id: Ms.Types.ObjectId ) {
		return this.userService.getById(id);
	}

	@Mutation(() => User)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(Role.User, Role.Owner)
	updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
		return this.userService.update(updateUserInput);
	}

	@Mutation(() => User)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(Role.User, Role.Owner, Role.Admin)
	removeUser(@Context() { req }: ContextType) {
		return this.userService.delete(req.user.sub);
	}

	@Mutation(() => Boolean)
	@UseGuards(JwtAuthGuard)
	async updateToken(
		@Args('token', { type: () => String }) token: string,
		@Context() { req }: ContextType
	) {
		let payload = await this.authService.decode(token);
		if(!payload)  return new UnauthorizedException('Decoding the token failed.');

		let user = await this.userService.getById(payload.sub);
		if(!user) return new UnauthorizedException('Couldnt find user');

		let { access_token } = await this.authService.login(user);
		req.res.setHeader('Set-Cookie', 'token=' + access_token + "; Path=/;");

		return true;
	}

	@ResolveField()
	async lobby(
		@Parent() user: UserDocument
	) {
		await user.populate({ path: 'lobby', model: 'Lobby' })
		return user.lobby
	}
}
