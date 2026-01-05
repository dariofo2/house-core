import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getUserRolesNames = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const http = context.switchToHttp().getRequest<{ userRoles: string[] }>();
    return http['userRoles'];
  },
);
