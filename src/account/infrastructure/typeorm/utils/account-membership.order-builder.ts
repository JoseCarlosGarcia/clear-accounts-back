import { SortOption } from 'src/shared/domain/interfaces/sort-option';
import { BaseOrderBuilder } from 'src/shared/infrastructure/typeorm/utils/base-order-builder';
import { FindOptionsOrder } from 'typeorm';
import { SortDirection } from 'src/shared/application/requests/sort-options.request';
import { AccountMembershipModel } from '../models/account-membership.model';
import { AccountMembershipSort } from 'src/account/domain/enums/account-membership-sort';

export class AccountMembershipOrderBuilder extends BaseOrderBuilder<
  AccountMembershipModel,
  AccountMembershipSort
> {
  protected buildOrder(sortOptions?: SortOption<AccountMembershipSort>[]): void {
    if (!sortOptions || sortOptions.length === 0) return;

    sortOptions.forEach((sortOption) => {
      if (!sortOption?.field || !sortOption?.direction) return;

      switch (sortOption.field) {
        case AccountMembershipSort.CREATED_AT:
          this.order.createdAt = sortOption.direction;
          break;
        case AccountMembershipSort.ROLE:
          this.order.role = sortOption.direction;
          break;
        case AccountMembershipSort.ACCOUNT_NAME:
          this.order.account = {  name: sortOption.direction }
          break;
        case AccountMembershipSort.USER_NAME:
          this.order.user = { name: sortOption.direction };
          break;
      }
    });
  }
  protected getDefaultOrder(): FindOptionsOrder<AccountMembershipModel> {
    return { updatedAt: SortDirection.DESC };
  }
}
