import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { UserResponse } from 'src/user/application/queries/responses/user.response';
import { Auth } from '../decorators/auth.decorator';
import { CurrentUser } from 'src/shared/infrastructure/nest/decorators/current-user.decorator';
import { PasswordCrypt } from 'src/user/domain/services/password-crypt';
import { PasswordCompare } from 'src/user/domain/services/password-compare';
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

@Auth()
@Controller('users')
export class UserController {
  constructor(private readonly repository: TypeOrmUserRepository) {}

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserResponse> {
    const service = new UserFindById(this.repository);
    const query = new UserGetById(service);

    const user = await query.execute({ id });

    return user;
  }

  @Patch('change-password')
  async changePassword(
    @Body() request: ChangePasswordRequest,
    @CurrentUser() user: User,
  ): Promise<void> {
    const service = new UserChangePassword(
      this.repository,
      new PasswordCrypt(),
      new PasswordCompare(),
    );
    const command = new UserChangePasswordCommand(service);
    await command.execute({ request, user });
  }

  @Patch()
  async updateUser(
    @Body() request: UpdateUserRequest,
    @CurrentUser() user: User,
  ): Promise<void> {
    const service = new UserUpdate(this.repository);
    const command = new UserUpdateCommand(service);
    await command.execute({ request, user });
  }
}
