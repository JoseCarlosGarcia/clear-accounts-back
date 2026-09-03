import { AccountMembership } from '../../entities/account-membership.entity';
import { LastMemberCannotBeRemovedException } from '../../exceptions/account';
import { IAccountMembershipRepository } from '../../repositories/account-membership.repository';

interface Props {
  accountMembership: AccountMembership;
}

export class AccountMembershipEnsureNotLastMember {
  constructor(private readonly repository: IAccountMembershipRepository) {}

  async execute({ accountMembership }: Props): Promise<void> {
    const activeMemberships = await this.repository.countActiveMemberships(
      accountMembership.getAccountId(),
    );

    if (activeMemberships <= 1) throw new LastMemberCannotBeRemovedException();
  }
}

