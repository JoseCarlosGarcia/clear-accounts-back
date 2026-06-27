import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { EnvService } from 'src/app/modules/env/services/env';
import { TypeOrmUserRepository } from '../../typeorm/repository/user.repository';
import { AccessTokenVerificator } from 'src/user/domain/services/access-token-verificator';
import { User } from 'src/user/domain/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
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

    const verificator = new AccessTokenVerificator(
      this.jwtService,
      this.envService,
      this.repository,
    );

    request.user = await verificator.execute({ token });

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

