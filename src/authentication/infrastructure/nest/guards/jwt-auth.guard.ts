import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { EnvService } from 'src/env/services/env';
import { TypeOrmUserRepository } from '../../../../user/infrastructure/typeorm/repository/user.repository';
import { User } from 'src/user/domain/entities/user.entity';
import { JwtTokenService } from '../services/jwt-token-service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly envService: EnvService,
    private readonly repository: TypeOrmUserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: User }>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const tokenService = new JwtTokenService(this.envService);

    try {
      const payload = tokenService.verify(token);
      const user = await this.repository.findById(payload.id);

      if (!user) throw new UnauthorizedException();

      request.user = user;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
