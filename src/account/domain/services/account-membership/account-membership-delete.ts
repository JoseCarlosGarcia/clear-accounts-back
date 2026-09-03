import { AccountMembership } from '../../entities/account-membership.entity';
import { IAccountMembershipRepository } from '../../repositories/account-membership.repository';
import { AccountMembershipEnsureNotLastMember } from './account-membership-ensure-not-last-member';
import { AccountMembershipFindById } from './account-membership-find-by-id';
import { AccountMembershipUpdateOwners } from './account-membership-update-owners';

interface Props {
  id: string;
}

export class AccountMembershipDelete {
  constructor(
    private readonly acountMembershipRepository: IAccountMembershipRepository,
    private readonly findAccountMembership: AccountMembershipFindById,
    private readonly ensureNotLastMember: AccountMembershipEnsureNotLastMember,
    private readonly updateOwners: AccountMembershipUpdateOwners,
  ) {}

  async execute({ id }: Props): Promise<AccountMembership | null> {
    const accountMembership = await this.findAccountMembership.executeOrFail({
      id: id,
      isActive: true,
    });

    await this.ensureNotLastMember.execute({ accountMembership });
    if (accountMembership.isOwner()) {
      await this.updateOwners.execute({ accountMembership });
    }

    accountMembership.delete();
    await this.acountMembershipRepository.update(accountMembership);
    return accountMembership;
  }
}

