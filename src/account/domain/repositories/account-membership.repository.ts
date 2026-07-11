import { AccountMembership } from "../entities/account-membership.entity";

export interface IAccountMembershipRepository {
  findByAccountAndUser(
    accountId: string,
    userId: string,
  ): Promise<AccountMembership | null>;
}