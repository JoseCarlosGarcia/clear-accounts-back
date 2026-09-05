import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountMembershipModel } from './infrastructure/typeorm/models/account-membership.model';
import { AccountModel } from './infrastructure/typeorm/models/account.model';
import { TypeOrmAccountMembershipRepository } from './infrastructure/typeorm/repositories/account-membership.repository';
import { TypeOrmAccountRepository } from './infrastructure/typeorm/repositories/account.repository';
import { AccountController } from './infrastructure/nest/controllers/account.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountModel, AccountMembershipModel]),
    UserModule,
  ],
  controllers: [AccountController],
  exports: [TypeOrmAccountMembershipRepository, TypeOrmAccountRepository],
  providers: [TypeOrmAccountMembershipRepository, TypeOrmAccountRepository],
})
export class AccountModule {}
