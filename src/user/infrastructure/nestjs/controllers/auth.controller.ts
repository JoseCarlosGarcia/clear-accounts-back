import { Body, Controller, Post } from '@nestjs/common';
import { UserPostgresRepository } from '../../postgres/repository/user';
import { JwtService } from '@nestjs/jwt';
import { SignInDTO } from 'src/user/application/dto/write/sign-in';
import { EnvService } from 'src/app/modules/env/services/env';
import { SignInResponse } from 'src/user/application/dto/read/sign-in';
import { AccessTokenCreator } from 'src/user/domain/services/access-token-creator';
import { PasswordCompare } from 'src/user/domain/services/password-compare';
import { SignInUser } from 'src/user/application/use-cases/auth/sign-in-user';
import { PasswordCrypt } from 'src/user/domain/services/password-crypt';
import { UserCreator } from 'src/user/domain/services/user-creator';
import { RegisterUser } from 'src/user/application/use-cases/user/register-user';
import { CreateUserDto } from 'src/user/application/dto/write/create-user';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly repository: UserPostgresRepository,
    private readonly jwtServices: JwtService,
    private readonly envService: EnvService,
  ) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<SignInResponse> {
    const hasher = new PasswordCrypt();
    const creator = new UserCreator(this.repository, hasher);
    const accessTokenCreator = new AccessTokenCreator(this.jwtServices, this.envService);

    const usecase = new RegisterUser(creator, accessTokenCreator);

    return await usecase.execute({ dto });
  }

  @Post('sign-in')
  async signIn(@Body() dto: SignInDTO): Promise<SignInResponse> {
    const accessTokenCreator = new AccessTokenCreator(
      this.jwtServices,
      this.envService,
    );

    const comparator = new PasswordCompare();

    const usecase = new SignInUser(
      this.repository,
      accessTokenCreator,
      comparator,
    );

    const user = await usecase.execute({ dto: dto });

    return user;
  }
}
