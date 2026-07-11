import { AccountMembership } from 'src/account/domain/entities/account-membership.entity';
import { IAccountMembershipRepository } from 'src/account/domain/repositories/account-membership.repository';
import { NotAccountMemberException } from '../exceptions/account-access';

interface Props {
  userId: string;
  accountId: string;
}

export class EnsureAccountMember {
  constructor(private readonly repository: IAccountMembershipRepository) {}

  async executeOrFail({ userId, accountId }: Props): Promise<AccountMembership> {
    const membership = await this.repository.findByAccountAndUser(accountId, userId);

    if (!membership) throw new NotAccountMemberException();

    return membership;
  }
}