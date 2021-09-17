import { Resolver, Query, Mutation, Args, Parent, ResolveField } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Schema as Ms } from 'mongoose';

import { UserService } from './user.service';
import { User, UserDocument } from './user.model';
import { CreateUserInput, ListUserInput, UpdateUserInput } from './user.inputs'
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Context, ContextType } from 'src/context.decorator';


@Resolver(() => User)
export class UserResolver {
	constructor(
		private readonly userService: UserService,
		private authService: AuthService
	) {}

	@Mutation(() => User)
	async createUser(
		@Args('createUserInput') createUserInput: CreateUserInput,
		@Context() { req }: ContextType
		) {
		let user = await this.userService.create(createUserInput);
		let token = await this.authService.login(user);
		if(token) {
			req.res.setHeader('Set-Cookie', 'token=' + token.access_token+ "; Path=/; HttpOnly;");
			
			return user;
		} else {
			throw new UnauthorizedException();
		}
	}

	@Query(() => User, { name: 'me' })
	@UseGuards(JwtAuthGuard)
	me(@Context() { req }: ContextType ) {
		return this.userService.getById(req.user.user_id);
	}

	@Query(() => [User], { name: 'users' })
	findAll(@Args('filters', { nullable: true }) filters: ListUserInput ) {
		return this.userService.list(filters);
	}

	@Query(() => User, { name: 'user' })
	findOne(@Args('id', { type: () => String }) id: Ms.Types.ObjectId ) {
		return this.userService.getById(id);
	}

	@Mutation(() => User)
	updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
		return this.userService.update(updateUserInput);
	}

	@Mutation(() => User)
	removeUser(@Args('id', { type: () => String }) id: Ms.Types.ObjectId) {
		return this.userService.delete(id);
	}

	@ResolveField()
	async lobby(
		@Parent() user: UserDocument
	) {
		await user.populate({ path: 'lobby', model: 'Lobby' })
		return user.lobby
	}
}
