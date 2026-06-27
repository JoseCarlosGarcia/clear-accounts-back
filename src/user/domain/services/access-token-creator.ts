import { JwtService } from '@nestjs/jwt';
import { EnvService } from 'src/app/modules/env/services/env';

interface Props {
  id: string;
}

export class AccessTokenCreator {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envServices: EnvService,
  ) {}

  execute({ id }: Props): string {
    return this.jwtService.sign(
      { id: id },
      {
        expiresIn: this.envServices.TOKEN_EXPIRES_TIME,
        secret: this.envServices.ACCCESS_TOKEN_SECRET_WORD,
      },
    );
  }
}

