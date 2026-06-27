import { Body, Controller, Post } from '@nestjs/common';
import { TypeOrmUserRepository } from '../../typeorm/repository/user.repository';
import { JwtService } from '@nestjs/jwt';
import { SignInDTO } from 'src/user/application/use-cases/auth/requests/sign-in';
import { EnvService } from 'src/app/modules/env/services/env';
import { SignInResponse } from 'src/user/application/use-cases/auth/responses/sign-in';
import { AccessTokenCreator } from 'src/user/domain/services/access-token-creator';
import { PasswordCompare } from 'src/user/domain/services/password-compare';
import { SignInUser } from 'src/user/application/use-cases/auth/sign-in-user';
import { PasswordCrypt } from 'src/user/domain/services/password-crypt';
import { UserCreate } from 'src/user/domain/services/user-create';
import { RegisterUser } from 'src/user/application/commands/register-user';
import { CreateUserRequest } from 'src/user/application/commands/requests/create-user.request';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly repository: TypeOrmUserRepository,
    private readonly jwtServices: JwtService,
    private readonly envService: EnvService,
  ) {}

  @Post('register')
  async register(@Body() dto: CreateUserRequest): Promise<SignInResponse> {
    const hasher = new PasswordCrypt();
    const creator = new UserCreate(this.repository, hasher);
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
