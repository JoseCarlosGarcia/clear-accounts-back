import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/nestjs/controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './infrastructure/postgres/entity/user.model';
import { UserPostgresRepository } from './infrastructure/postgres/repository/user';
import { AuthController } from './infrastructure/nestjs/controllers/auth.controller';
import { UserServices } from './domain/services/user-services';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  controllers: [UserController, AuthController],
  exports: [],
  providers: [UserPostgresRepository, UserServices, JwtService],
})
export class UserModule {}
