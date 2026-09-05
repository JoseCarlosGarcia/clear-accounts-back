import { Body, Controller, Get, Inject, Param, Patch } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponse } from 'src/user/application/queries/responses/user.response';
import { CurrentUser } from 'src/shared/infrastructure/nest/decorators/current-user.decorator';
import { BcryptPasswordHasher } from 'src/authentication/infrastructure/nest/services/bcrypt-password-hasher';
import { ChangePasswordRequest } from 'src/user/application/commands/requests/change-password.request';
import { UserChangePasswordCommand } from 'src/user/application/commands/user-change-password.command';
import { UserChangePassword } from 'src/user/domain/services/user-change-password';
import { UpdateUserRequest } from 'src/user/application/commands/requests/update-user.request';
import { UserUpdateCommand } from 'src/user/application/commands/user-update.command';
import { UserUpdate } from 'src/user/domain/services/user-update';
import { User } from 'src/user/domain/entities/user.entity';
import { TypeOrmUserRepository } from '../../typeorm/repository/user.repository';
import { UserGetById } from 'src/user/application/queries/user-get-by-id.query';
import { UserFindById } from 'src/user/domain/services/user-find-by-id';
import { Auth } from 'src/authentication/infrastructure/nest/decorators/auth.decorator';
import { TransactionExecutor } from 'src/shared/infrastructure/typeorm/typeorm-transaction.executor';

@Auth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    @Inject()
    private readonly transactionExecutor: TransactionExecutor,
    @Inject()
    private readonly repository: TypeOrmUserRepository,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por su identificador' })
  @ApiOkResponse({ type: UserResponse })
  @ApiNotFoundResponse({
    description: 'user-not-found: no existe o está desactivado',
  })
  async findById(@Param('id') id: string): Promise<UserResponse> {
    const service = new UserFindById(this.repository);
    const query = new UserGetById(service);

    const user = await query.execute({ id });

    return user;
  }

  @Patch('change-password')
  @ApiOperation({
    summary: 'Cambiar la contraseña del usuario autenticado',
    description: 'Exige la contraseña actual para confirmar el cambio.',
  })
  @ApiOkResponse({ description: 'Contraseña actualizada' })
  @ApiConflictResponse({
    description: 'not-equal-passwords: la contraseña actual no coincide',
  })
  async changePassword(
    @Body() request: ChangePasswordRequest,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.transactionExecutor.execute(async () => {
      const service = new UserChangePassword(
        this.repository,
        new BcryptPasswordHasher(),
      );
      const command = new UserChangePasswordCommand(service);
      return command.execute({ request, user });
    });
  }

  @Patch()
  @ApiOperation({ summary: 'Editar el nombre y el correo del usuario autenticado' })
  @ApiOkResponse({ description: 'Usuario actualizado' })
  @ApiConflictResponse({
    description: 'repeat-user: otro usuario activo ya usa ese correo',
  })
  async updateUser(
    @Body() request: UpdateUserRequest,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.transactionExecutor.execute(async () => {
      const service = new UserUpdate(this.repository);
      const command = new UserUpdateCommand(service);
      return command.execute({ request, user });
    });
  }
}
