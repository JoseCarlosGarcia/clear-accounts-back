import { FindOptionsWhere } from 'typeorm';
import { BaseWhereBuilder } from 'src/shared/infrastructure/typeorm/utils/base-where-builder';
import { WhereUtils } from 'src/shared/infrastructure/typeorm/utils/where.util';
import { AccountMembershipModel } from '../models/account-membership.model';
import { AccountModel } from '../models/account.model';
import { AccountMembershipPaginationParams } from 'src/account/domain/interfaces/account-membership-pagination-params';

export class AccountMembershipWhereBuilder extends BaseWhereBuilder<
  AccountMembershipModel,
  AccountMembershipPaginationParams
> {
  protected buildWhereConditions(
    where: FindOptionsWhere<AccountMembershipModel>,
    filters: AccountMembershipPaginationParams,
  ): void | FindOptionsWhere<AccountMembershipModel> | FindOptionsWhere<AccountMembershipModel>[] {
    where.active = WhereUtils.assignIfExists(filters.isActive);
    where.account_id = WhereUtils.assignIfExists(filters.accountId);
    where.user_id = WhereUtils.assignIfExists(filters.userId);
    where.role = WhereUtils.orCondition(filters.accountRole);
    where.createdAt = WhereUtils.dateRange(
      filters.createdAtMin,
      filters.createdAtMax,
    );

    const account: FindOptionsWhere<AccountModel> = {
      name: WhereUtils.ilikeUnaccent(filters.accountName),
      active: WhereUtils.assignIfExists(filters.isAccountActive),
    };

    if (Object.values(account).some((condition) => condition !== undefined)) {
      where.account = account;
    }

    return where;
  }
}
