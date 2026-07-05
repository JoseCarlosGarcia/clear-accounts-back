import { Body, Controller, Inject, Post } from '@nestjs/common';
import { EnvService } from 'src/app/modules/env/services/env';
import { UserCreate } from 'src/user/domain/services/user-create';
import { CreateUserRequest } from 'src/user/application/commands/requests/create-user.request';
import { TypeOrmUserRepository } from 'src/user/infrastructure/typeorm/repository/user.repository';
import { SignInResponse } from 'src/authentication/application/commands/responses/sign-in.response';
import { UlidGenerator } from 'src/shared/domain/services/ulid.generator';
import { UserRegisterCommand } from 'src/user/application/commands/user-register.command';
import { SignInRequest } from 'src/authentication/application/commands/requests/sign-in.request';
import { SignIn } from 'src/authentication/domain/services/sign-in';
import { SignInCommand } from 'src/authentication/application/commands/sign-in.command';
import { BcryptPasswordHasher } from '../services/bcrypt-password-hasher';
import { JwtTokenService } from '../services/jwt-token-service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject()
    private readonly repository: TypeOrmUserRepository,
    @Inject()
    private readonly envService: EnvService,
    @Inject()
    private readonly idGenerator: UlidGenerator,
  ) {}

  @Post('register')
  async register(@Body() body: CreateUserRequest): Promise<SignInResponse> {
    const hasher = new BcryptPasswordHasher();
    const creator = new UserCreate(this.repository, this.idGenerator, hasher);
    const tokenService = new JwtTokenService(this.envService);

    const usecase = new UserRegisterCommand(creator, tokenService);

    return await usecase.execute({ request: body });
  }

  @Post('sign-in')
  async signIn(@Body() body: SignInRequest): Promise<SignInResponse> {
    const tokenService = new JwtTokenService(this.envService);
    const hasher = new BcryptPasswordHasher();

    const service = new SignIn(this.repository, tokenService, hasher);
    const usecase = new SignInCommand(service);

    return await usecase.execute(body);
  }
}
