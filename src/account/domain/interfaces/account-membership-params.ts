import { PaginationParams } from 'src/shared/domain/interfaces/pagination';
import { AccountRole } from '../enums/account-role';
import { SortOption } from 'src/shared/domain/interfaces/sort-option';
import { AccountMembershipSort } from '../enums/account-membership-sort';

export interface AccountMembershipPaginationParams extends PaginationParams {
  accountId?: string;
  userId?: string;
  createdAtMin?: Date;
  createdAtMax?: Date;
  isActive?: boolean;
  accountRole?: AccountRole[];
  sort?: SortOption<AccountMembershipSort>[];
}
