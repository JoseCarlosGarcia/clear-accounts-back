import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export const JWT_AUTH = 'JWT-auth';

export function Auth() {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(JWT_AUTH),
    ApiUnauthorizedResponse({ description: 'Token ausente, inválido o expirado' }),
  );
}
