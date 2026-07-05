import { JwtService } from '@nestjs/jwt';
import { EnvService } from 'src/app/modules/env/services/env';
import { TokenPayload } from 'src/authentication/domain/interfaces/token-payload';
import { TokenService } from 'src/authentication/domain/interfaces/token-service';

export class JwtTokenService implements TokenService {
  private readonly jwtService = new JwtService();

  constructor(private readonly envService: EnvService) {}

  sign(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.envService.TOKEN_EXPIRES_TIME,
      secret: this.envService.ACCESS_TOKEN_SECRET_WORD,
    });
  }

  verify(token: string): TokenPayload {
    return this.jwtService.verify<TokenPayload>(token, {
      secret: this.envService.ACCESS_TOKEN_SECRET_WORD,
    });
  }
}
