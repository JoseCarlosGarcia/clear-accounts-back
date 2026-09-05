import { PaginationResult } from 'src/shared/domain/interfaces/pagination';
import { Account } from '../entities/account.entity';
import { AccountPaginationParams } from '../interfaces/account-pagination-params';

export interface IAccountRepository {
  save(account: Account): Promise<void>;
  update(account: Account): Promise<void>;
  find(props: AccountPaginationParams): Promise<PaginationResult<Account>>;
  findById(id: string): Promise<Account | null>;
}
