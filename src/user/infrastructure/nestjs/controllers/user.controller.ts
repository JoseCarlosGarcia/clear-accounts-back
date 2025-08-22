import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UserPostgresRepository } from '../../postgres/repository/user';
import { GetUserById } from 'src/user/application/use-cases/user/get-user-by-id';
import { UserResponse } from 'src/user/application/dto/read/user';
import { CreateUserDto } from 'src/user/application/dto/write/dto/create-user';
import { UserCreator } from 'src/user/domain/services/user-creator';
import { CreateUser } from 'src/user/application/use-cases/user/create-user';

@Controller('user')
export class UserController {
  constructor(
    private readonly repository: UserPostgresRepository,
  ) {}

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<UserResponse> {
    const usecase = new GetUserById(this.repository);

    const user = await usecase.execute({ id: id });

    return user;
  }

  @Post()
  async createAdmin(@Body() dto: CreateUserDto): Promise<void> {
    const creator = new UserCreator(this.repository);

    const usecase = new CreateUser(creator);

    await usecase.execute({ dto: dto });
  }
}
