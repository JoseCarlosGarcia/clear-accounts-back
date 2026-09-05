import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { EnvService } from 'src/env/services/env';
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

@ApiTags('Auth')
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
  @ApiOperation({
    summary: 'Registrar un usuario',
    description:
      'Crea el usuario y devuelve directamente su token de acceso, sin necesidad de iniciar sesión después.',
  })
  @ApiCreatedResponse({ type: SignInResponse })
  @ApiConflictResponse({
    description: 'repeat-user: ya existe un usuario activo con ese correo',
  })
  async register(@Body() body: CreateUserRequest): Promise<SignInResponse> {
    const hasher = new BcryptPasswordHasher();
    const creator = new UserCreate(this.repository, this.idGenerator, hasher);
    const tokenService = new JwtTokenService(this.envService);

    const usecase = new UserRegisterCommand(creator, tokenService);

    return await usecase.execute({ request: body });
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiCreatedResponse({ type: SignInResponse })
  @ApiUnauthorizedResponse({
    description: 'invalid-credentials: correo o contraseña incorrectos',
  })
  async signIn(@Body() body: SignInRequest): Promise<SignInResponse> {
    const tokenService = new JwtTokenService(this.envService);
    const hasher = new BcryptPasswordHasher();

    const service = new SignIn(this.repository, tokenService, hasher);
    const usecase = new SignInCommand(service);

    return await usecase.execute(body);
  }
}

