import { AccountMembership } from 'src/account/domain/entities/account-membership.entity';
import { AccountMembershipFindByAccountAndUser } from 'src/account/domain/services/account-membership/account-membership-find-by-account-and-user';
import { NotAccountMemberException } from '../../exceptions/account-access';

interface Props {
  userId: string;
  accountId: string;
}

export class EnsureAccountMember {
  constructor(
    private readonly findAccountMembership: AccountMembershipFindByAccountAndUser,
  ) {}

  async executeOrFail({ userId, accountId }: Props): Promise<AccountMembership> {
    const membership = await this.findAccountMembership.execute({
      accountId: accountId,
      userId: userId,
      onlyActive: true,
    });

    if (!membership) throw new NotAccountMemberException();

    return membership;
  }
}
