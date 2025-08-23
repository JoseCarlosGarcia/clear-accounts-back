import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/nestjs/controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/postgres/entity/user.entity';
import { UserPostgresRepository } from './infrastructure/postgres/repository/user';
import { AuthController } from './infrastructure/nestjs/controllers/auth';
import { UserServices } from './domain/services/user-services';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController, AuthController],
  exports: [],
  providers: [UserPostgresRepository, UserServices, JwtService],
})
export class UserModule {}
