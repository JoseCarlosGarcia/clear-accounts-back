import { AccountMembership } from '../../entities/account-membership.entity';
import { AccountNotFoundException } from '../../exceptions/account';
import { IAccountMembershipRepository } from '../../repositories/account-membership.repository';

interface Props {
  id: string;
  isActive: boolean;
}

export class AccountMembershipFindById {
  constructor(private readonly repository: IAccountMembershipRepository) {}

  async execute({ id, isActive }: Props): Promise<AccountMembership | null> {
    const accountMembership = await this.repository.findById(id);

    if (isActive && accountMembership && !accountMembership.isActive()) return null;

    return accountMembership;
  }

  async executeOrFail({ id, isActive }: Props): Promise<AccountMembership> {
    const accountMembership = await this.repository.findById(id);

    if (!accountMembership) throw new AccountNotFoundException();

    if (isActive && !accountMembership.isActive()) throw new AccountNotFoundException();

    return accountMembership;
  }
}
