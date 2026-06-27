import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/domain/entities/user.entity';

/**
 * Devuelve el usuario autenticado desde el request.
 * Lo rellena el guard de autenticación (`request.user`) en Fase 3.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<{ user: User }>();
    return request.user;
  },
);
