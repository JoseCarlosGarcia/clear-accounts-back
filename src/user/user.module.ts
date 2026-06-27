import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/nestjs/controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './infrastructure/typeorm/models/user.model';
import { TypeOrmUserRepository } from './infrastructure/typeorm/repository/user.repository';
import { AuthController } from './infrastructure/nestjs/controllers/auth.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  controllers: [UserController, AuthController],
  exports: [],
  providers: [TypeOrmUserRepository, JwtService],
})
export class UserModule {}
