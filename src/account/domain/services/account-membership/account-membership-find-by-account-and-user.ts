import { AccountMembership } from '../../entities/account-membership.entity';
import { AccountMembershipNotFoundException } from '../../exceptions/account';
import { IAccountMembershipRepository } from '../../repositories/account-membership.repository';

interface Props {
  accountId: string;
  userId: string;
  onlyActive: boolean;
}

export class AccountMembershipFindByAccountAndUser {
  constructor(private readonly repository: IAccountMembershipRepository) {}

  async execute({
    accountId,
    userId,
    onlyActive,
  }: Props): Promise<AccountMembership | null> {
    const accountMembership = await this.repository.findByAccountAndUser(
      accountId,
      userId,
    );

    if (onlyActive && accountMembership && !accountMembership.isActive())
      return null;

    return accountMembership;
  }

  async executeOrFail({
    accountId,
    userId,
    onlyActive,
  }: Props): Promise<AccountMembership> {
    const accountMembership = await this.repository.findByAccountAndUser(
      accountId,
      userId,
    );

    if (!accountMembership) throw new AccountMembershipNotFoundException();

    if (onlyActive && !accountMembership.isActive())
      throw new AccountMembershipNotFoundException();

    return accountMembership;
  }
}
