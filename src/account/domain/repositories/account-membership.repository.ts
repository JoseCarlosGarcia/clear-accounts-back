import { PaginationResult } from "src/shared/domain/interfaces/pagination";
import { AccountMembership } from "../entities/account-membership.entity";
import { AccountMembershipPaginationParams } from "../interfaces/account-membership-pagination-params";

export interface IAccountMembershipRepository {
  save(accountMembership: AccountMembership): Promise<void>;
  update(accountMembership: AccountMembership): Promise<void>;
  findById(id: string): Promise<AccountMembership | null>;
  find(props: AccountMembershipPaginationParams): Promise<PaginationResult<AccountMembership>>;
  findByAccountAndUser(
    accountId: string,
    userId: string,
  ): Promise<AccountMembership | null>;
  countActiveOwners(accountId: string): Promise<number>;
  countActiveMemberships(accountId: string): Promise<number>;
}