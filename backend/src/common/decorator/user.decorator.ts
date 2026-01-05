import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import User from 'src/database/entities/user/user.entity';

export const user = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const http = context.switchToHttp().getRequest<{ user: User }>();
    return http['user'];
  },
);
