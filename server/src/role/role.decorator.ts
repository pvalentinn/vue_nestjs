import { SetMetadata } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';

export enum Role {
    User = 'user',
    Owner = 'owner',
    Admin = 'admin',
}

registerEnumType(Role, { name: "Role" });
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);