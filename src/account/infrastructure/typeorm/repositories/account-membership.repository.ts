import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseTypeOrmRepository } from 'src/shared/infrastructure/typeorm/base-typeorm.repository';
import { TransactionExecutor } from 'src/shared/infrastructure/typeorm/typeorm-transaction.executor';
import { IAccountMembershipRepository } from 'src/account/domain/repositories/account-membership.repository';
import { AccountMembershipModel } from '../models/account-membership.model';
import { AccountMembershipMapper } from '../mappers/account-membership-mapper';
import { AccountMembership } from 'src/account/domain/entities/account-membership.entity';
import { AccountRole } from 'src/account/domain/enums/account-role';
import { AccountMembershipPaginationParams } from 'src/account/domain/interfaces/account-membership-pagination-params';
import { PaginationResult } from 'src/shared/domain/interfaces/pagination';
import {
  getPaginationInfo,
  getPaginationOptions,
} from 'src/shared/infrastructure/utils/pagination.util';
import { AccountMembershipWhereBuilder } from '../utils/account-membership.where-builder';
import { AccountMembershipOrderBuilder } from '../utils/account-membership.order-builder';
import { AccountMembershipRelationsBuilder } from '../relations/account-membership.relations-builder';

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

  async findById(id: string): Promise<AccountMembership | null> {
    const found = await this.repository.findOne({
      where: { id: id },
      relations: AccountMembershipRelationsBuilder.build(),
    });

    return found ? AccountMembershipMapper.toDomain(found) : null;
  }

  async find(
    props: AccountMembershipPaginationParams,
  ): Promise<PaginationResult<AccountMembership>> {
    const where = AccountMembershipWhereBuilder.build(props);
    const order = AccountMembershipOrderBuilder.build(props.sort);
    const { skip, take } = getPaginationOptions(props);

    const [items, totalItems] = await this.repository.findAndCount({
      where,
      order,
      skip,
      take,
      relations: AccountMembershipRelationsBuilder.build(),
    });
    const pagination = getPaginationInfo(totalItems, props);

    return {
      items: AccountMembershipMapper.toDomainList(items),
      totalItems,
      pagination,
    };
  }

  async save(accountMembership: AccountMembership): Promise<void> {
    const model = AccountMembershipMapper.toModel(accountMembership);
    await this.repository.save(model);
  }

  async update(accountMembership: AccountMembership): Promise<void> {
    await this.repository.update(
      { id: accountMembership.getId() },
      {
        role: accountMembership.getRole(),
        active: accountMembership.isActive(),
      },
    );
  }

  async findByAccountAndUser(
    accountId: string,
    userId: string,
  ): Promise<AccountMembership | null> {
    const found = await this.repository.findOne({
      where: {
        account_id: accountId,
        user_id: userId,
      },
      relations: AccountMembershipRelationsBuilder.build(),
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

