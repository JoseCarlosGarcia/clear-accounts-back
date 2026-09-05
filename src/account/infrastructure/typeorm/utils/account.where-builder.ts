import { AccountPaginationParams } from 'src/account/domain/interfaces/account-pagination-params';
import { FindOptionsWhere } from 'typeorm';
import { AccountModel } from '../models/account.model';
import { BaseWhereBuilder } from 'src/shared/infrastructure/typeorm/utils/base-where-builder';
import { WhereUtils } from 'src/shared/infrastructure/typeorm/utils/where.util';

export class AccountWhereBuilder extends BaseWhereBuilder<
  AccountModel,
  AccountPaginationParams
> {
  protected buildWhereConditions(
    where: FindOptionsWhere<AccountModel>,
    filters: AccountPaginationParams,
  ): void | FindOptionsWhere<AccountModel> | FindOptionsWhere<AccountModel>[] {
    where.active = WhereUtils.assignIfExists(filters.isActive);
    where.name = WhereUtils.ilikeUnaccent(filters.name);
    where.initialBalance = WhereUtils.range(
      filters.initialBalanceMin,
      filters.initialBalanceMax,
    );
    where.createdAt = WhereUtils.dateRange(
      filters.createdAtMin,
      filters.createdAtMax,
    );

    return where;
  }
}
