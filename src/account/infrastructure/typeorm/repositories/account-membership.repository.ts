import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseTypeOrmRepository } from 'src/shared/infrastructure/typeorm/base-typeorm.repository';
import { TransactionExecutor } from 'src/shared/infrastructure/typeorm/typeorm-transaction.executor';
import { IAccountMembershipRepository } from 'src/account/domain/repositories/account-membership.repository';
import { AccountMembershipModel } from '../models/account-membership.model';
import { AccountMembershipMapper } from '../mappers/account-membership-mapper';
import { AccountMembership } from 'src/account/domain/entities/account-membership.entity';
import { AccountRole } from 'src/account/domain/enums/account-role';

@Injectable()
export class TypeOrmAccountMembershipRepository
  extends BaseTypeOrmRepository<AccountMembershipModel>
  implements IAccountMembershipRepository
{
  constructor(
    dataSource: DataSource,
    transactionExecutor: TransactionExecutor,
  ) {
    super(dataSource, transactionExecutor, AccountMembershipModel);
  }

  async findByAccountAndUser(
    accountId: string,
    userId: string,
  ): Promise<AccountMembership | null> {
    const found = await this.repository.findOne({
      where: {
        account_id: accountId,
        user_id: userId,
        active: true,
      },
    });

    return found ? AccountMembershipMapper.toDomain(found) : null;
  }

  async countActiveOwners(accountId: string): Promise<number> {
    return this.repository.count({
      where: {
        account_id: accountId,
        role: AccountRole.OWNER,
        active: true,
      },
    });
  }

  async countActiveMemberships(accountId: string): Promise<number> {
    return this.repository.count({
      where: {
        account_id: accountId,
        active: true,
      },
    });
  }
}

