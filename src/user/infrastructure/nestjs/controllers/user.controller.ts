import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
} from '@nestjs/common';
import { UserPostgresRepository } from '../../postgres/repository/user';
import { GetUserById } from 'src/user/application/use-cases/user/get-user-by-id';
import { UserResponse } from 'src/user/application/dto/read/user';
import { Auth } from '../decorators/auth';
import { PasswordCrypt } from 'src/user/domain/services/password-crypt';
import { ChangePasswordDTO } from 'src/user/application/dto/write/change-password';
import { PasswordCompare } from 'src/user/domain/services/password-compare';
import { ChangeUserPassword } from 'src/user/application/use-cases/user/change-user-password';
import { UpdateUserDto } from 'src/user/application/dto/write/update-user';
import { UpdateUser } from 'src/user/application/use-cases/user/update-user';
import { User } from 'src/user/domain/entities/user';

@Auth()
@Controller('user')
export class UserController {
  constructor(private readonly repository: UserPostgresRepository) {}

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<UserResponse> {
    const usecase = new GetUserById(this.repository);

    const user = await usecase.execute({ id: id });

    return user;
  }

  @Patch('change-password')
  async changePassword(
    @Body() dto: ChangePasswordDTO,
    @Req() req: Request & { user: User },
  ) {
    const hasher = new PasswordCrypt();
    const comparator = new PasswordCompare();
    const usecase = new ChangeUserPassword(this.repository, hasher, comparator);

    await usecase.execute({ dto: dto, user: req.user });
  }

  @Patch()
  async updateUser(
    @Body() dto: UpdateUserDto,
    @Req() req: Request & { user: User },
  ): Promise<void> {
    const user = req.user;
    const usecase = new UpdateUser(this.repository);
    await usecase.execute({ dto, user });
  }
}
