import { Resolver, Query, Mutation, Args, Parent, ResolveField, GqlExecutionContext } from '@nestjs/graphql';
import { createParamDecorator, ExecutionContext, Req, UseGuards } from '@nestjs/common';
import { Schema as Ms } from 'mongoose';

import { UserService } from './user.service';
import { User, UserDocument } from './user.model';
import { CreateUserInput, ListUserInput, UpdateUserInput } from './user.inputs'
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


export const CurrentUser = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
	  const ctx = GqlExecutionContext.create(context);
	  return ctx.getContext().req.user;
	},
);

@Resolver(() => User)
export class UserResolver {
	constructor(
		private readonly userService: UserService,
		private authService: AuthService
	) {}

	@Mutation(() => User)
	async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
		let user = await this.userService.create(createUserInput);
		console.log(await this.authService.login(user));
		return user;
	}

	@Query(() => User, { name: 'me' })
	@UseGuards(JwtAuthGuard)
	me(@CurrentUser() user: any) {
		console.log('here', user);
		return this.userService.getById(user.userId);
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
