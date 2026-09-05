import { SortOption } from 'src/shared/domain/interfaces/sort-option';
import { BaseOrderBuilder } from 'src/shared/infrastructure/typeorm/utils/base-order-builder';
import { FindOptionsOrder } from 'typeorm';
import { AccountModel } from '../models/account.model';
import { AccountSort } from 'src/account/domain/enums/account-sort';
import { SortDirection } from 'src/shared/application/requests/sort-options.request';

export class AccountOrderBuilder extends BaseOrderBuilder<
  AccountModel,
  AccountSort
> {
  protected buildOrder(sortOptions?: SortOption<AccountSort>[]): void {
    if (!sortOptions || sortOptions.length === 0) return;

    sortOptions.forEach((sortOption) => {
      if (!sortOption?.field || !sortOption?.direction) return;

      switch (sortOption.field) {
        case AccountSort.CREATED_AT:
          this.order.createdAt = sortOption.direction;
          break;
        case AccountSort.NAME:
          this.order.name = sortOption.direction;
          break;
        case AccountSort.INITIAL_BALANCE:
          this.order.initialBalance = sortOption.direction;
          break;
        case AccountSort.CREATED_BY:
          this.order.createdBy = { name: sortOption.direction };
          break;
      }
    });
  }
  protected getDefaultOrder(): FindOptionsOrder<AccountModel> {
    return { updatedAt: SortDirection.DESC };
  }
}
