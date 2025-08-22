import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/nestjs/controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/postgres/entity/user.entity';
import { UserPostgresRepository } from './infrastructure/postgres/repository/user';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  exports: [],
  providers: [UserPostgresRepository],
})
export class UserModule {}
