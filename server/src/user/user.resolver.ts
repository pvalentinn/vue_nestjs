import { Resolver, Query, Mutation, Args, Parent, ResolveField } from '@nestjs/graphql';
import { Schema as Ms } from 'mongoose';

import { UserService } from './user.service';
import { User, UserDocument } from './user.model';
import { CreateUserInput, ListUserInput, UpdateUserInput } from './user.inputs'

@Resolver(() => User)
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Mutation(() => User)
	createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
		return this.userService.create(createUserInput);
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
