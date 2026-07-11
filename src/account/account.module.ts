import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountMembershipModel } from './infrastructure/typeorm/models/account-membership.model';
import { TypeOrmAccountMembershipRepository } from './infrastructure/typeorm/repositories/account-membership.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AccountMembershipModel])],
  controllers: [],
  exports: [TypeOrmAccountMembershipRepository],
  providers: [TypeOrmAccountMembershipRepository],
})
export class AccountModule {}
