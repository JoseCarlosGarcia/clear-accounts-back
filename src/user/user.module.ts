import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/nest/controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './infrastructure/typeorm/models/user.model';
import { TypeOrmUserRepository } from './infrastructure/typeorm/repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  controllers: [UserController],
  exports: [TypeOrmUserRepository],
  providers: [TypeOrmUserRepository],
})
export class UserModule {}
