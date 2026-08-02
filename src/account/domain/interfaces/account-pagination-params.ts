import { PaginationParams } from 'src/shared/domain/interfaces/pagination';
import { AccountRole } from '../enums/account-role';

export interface AccountPaginationParams extends PaginationParams {
  userId: string;
  name?: string;
  createdAtMin?: Date;
  createdAtMax?: Date;
  isShared?: boolean;
  isActive?: boolean;
  accountRole?: AccountRole[];
}
