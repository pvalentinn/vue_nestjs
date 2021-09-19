import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PayloadType } from 'src/auth/jwt.payload';
import { Role, ROLES_KEY } from './role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
    ]);

    if (!requiredRoles) {
        return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const user:PayloadType = ctx.getContext().req.user;

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}