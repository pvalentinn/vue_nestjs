import { Resolver, Query, Mutation, Args, Parent, ResolveField } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
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
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserResolver {
	constructor(
		private readonly userService: UserService,
		private authService: AuthService
	) {}

	@Mutation(() => User)
	@UseGuards()
	async createUser(
		@Args('createUserInput') createUserInput: CreateUserInput,
		@Context() { req }: ContextType
		) {
		let user = await this.userService.create(createUserInput);
		let { access_token } = await this.authService.login(user);
		if(access_token) {
			req.res.setHeader('Set-Cookie', 'token=' + access_token + "; Path=/; HttpOnly;");
			
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
	@Roles(Role.Admin)
	findAll(@Args('filters', { nullable: true }) filters: ListUserInput ) {
		return this.userService.list(filters);
	}

	@Query(() => User, { name: 'user' })
	@Roles(Role.Admin)
	findOne(@Args('id', { type: () => String }) id: Ms.Types.ObjectId ) {
		return this.userService.getById(id);
	}

	@Mutation(() => User)
	@Roles(Role.User, Role.Owner)
	updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
		return this.userService.update(updateUserInput);
	}

	@Mutation(() => User)
	@Roles(Role.Admin)
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
