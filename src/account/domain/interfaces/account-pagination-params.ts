import { PaginationParams } from 'src/shared/domain/interfaces/pagination';
import { AccountSort } from '../enums/account-sort';
import { SortOption } from 'src/shared/domain/interfaces/sort-option';

export interface AccountPaginationParams extends PaginationParams {
  userId: string;
  name?: string;
  createdAtMin?: Date;
  createdAtMax?: Date;
  initialBalanceMin?: number;
  initialBalanceMax?: number;
  isShared?: boolean;
  isActive?: boolean;
  sort?: SortOption<AccountSort>[];
}
