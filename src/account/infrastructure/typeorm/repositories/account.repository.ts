import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseTypeOrmRepository } from 'src/shared/infrastructure/typeorm/base-typeorm.repository';
import { TransactionExecutor } from 'src/shared/infrastructure/typeorm/typeorm-transaction.executor';
import { IAccountRepository } from 'src/account/domain/repositories/account.repository';
import { AccountModel } from '../models/account.model';
import { AccountMapper } from '../mappers/account-mapper';
import { Account } from 'src/account/domain/entities/account.entity';
import { PaginationResult } from 'src/shared/domain/interfaces/pagination';
import {
  getPaginationInfo,
  getPaginationOptions,
} from 'src/shared/infrastructure/utils/pagination.util';
import { AccountWhereBuilder } from '../utils/account.where-builder';
import { AccountOrderBuilder } from '../utils/account.order-builder';
import { AccountRelationsBuilder } from '../relations/account.relations-builder';
import { AccountPaginationParams } from 'src/account/domain/interfaces/account-pagination-params';

@Injectable()
export class TypeOrmAccountRepository
  extends BaseTypeOrmRepository<AccountModel>
  implements IAccountRepository
{
  constructor(
    dataSource: DataSource,
    transactionExecutor: TransactionExecutor,
  ) {
    super(dataSource, transactionExecutor, AccountModel);
  }

  async findById(id: string): Promise<Account | null> {
    const found = await this.repository.findOne({
      where: { id: id },
      relations: AccountRelationsBuilder.build(),
    });

    return found ? AccountMapper.toDomain(found) : null;
  }

  async find(
    props: AccountPaginationParams,
  ): Promise<PaginationResult<Account>> {
    const where = AccountWhereBuilder.build(props);
    const order = AccountOrderBuilder.build(props.sort);
    const { skip, take } = getPaginationOptions(props);

    const [items, totalItems] = await this.repository.findAndCount({
      where,
      order,
      skip,
      take,
      relations: AccountRelationsBuilder.build(),
    });
    const pagination = getPaginationInfo(totalItems, props);

    return {
      items: AccountMapper.toDomainList(items),
      totalItems,
      pagination,
    };
  }

  async save(account: Account): Promise<void> {
    const model = AccountMapper.toModel(account);
    await this.repository.save(model);
  }

  async update(account: Account): Promise<void> {
    await this.repository.update(
      { id: account.getId() },
      {
        active: account.isActive(),
        color: account.getColor(),
        initialBalance: account.getInitialBalance(),
        name: account.getName(),       
      },
    );
  }
}

