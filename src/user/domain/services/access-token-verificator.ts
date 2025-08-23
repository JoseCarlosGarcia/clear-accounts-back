import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user';
import { IUserRepository } from '../repository/user';
import { EnvService } from 'src/app/modules/env/services/env';
import { TokenPayload } from '../interface/token-payload';

interface Props {
  token: string;
}

export class AccessTokenVerificator {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envServices: EnvService,
    private readonly repository: IUserRepository,
  ) {}

  async execute({ token }: Props): Promise<User> {
    try {
      const payload = this.jwtService.verify<TokenPayload>(token, {
        secret: this.envServices.ACCCESS_TOKEN_SECRET_WORD,
      });

      const found = await this.repository.findById(payload.id);

      if (found) {
        return found;
      }

      throw new UnauthorizedException();
    } catch {
      throw new UnauthorizedException();
    }
  }
}
