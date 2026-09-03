import { SortDirection } from 'src/shared/application/requests/sort-options.request';
import { AccountMembership } from '../../entities/account-membership.entity';
import { AccountMembershipSort } from '../../enums/account-membership-sort';
import { AccountRole } from '../../enums/account-role';
import { AccountRequiresOwnerException } from '../../exceptions/account';
import { IAccountMembershipRepository } from '../../repositories/account-membership.repository';

interface Props {
  accountMembership: AccountMembership;
}

export class AccountMembershipUpdateOwners {
  constructor(private readonly repository: IAccountMembershipRepository) {}

  async execute({
    accountMembership,
  }: Props): Promise<AccountMembership | null> {
    if (!accountMembership.isOwner()) return null;

    const accountId = accountMembership.getAccountId();
    const activeOwners = await this.repository.countActiveOwners(accountId);

    if (activeOwners > 1) return null;

    const oldestMember = await this.findOldestMember(accountId);

    if (!oldestMember) throw new AccountRequiresOwnerException();

    oldestMember.setRole(AccountRole.OWNER);
    await this.repository.update(oldestMember);
    return oldestMember;
  }

  private async findOldestMember(
    accountId: string,
  ): Promise<AccountMembership | null> {
    const members = await this.repository.find({
      accountId: accountId,
      accountRole: [AccountRole.MEMBER],
      isActive: true,
      sort: [
        {
          field: AccountMembershipSort.CREATED_AT,
          direction: SortDirection.ASC,
        },
      ],
      page: 1,
      pageSize: 1,
    });

    return members.items[0] ?? null;
  }
}

