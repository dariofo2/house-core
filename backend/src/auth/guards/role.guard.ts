import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import User from 'src/db/entities/user/user.entity';

@Injectable()
export default class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{ user: User }>();

    const rolesUser: string[] = [];
    for (const userRole of user.userRoles) {
      rolesUser.push(userRole.role.name);
    }
    return requiredRoles.some((x) => rolesUser.includes(x));
  }
}
