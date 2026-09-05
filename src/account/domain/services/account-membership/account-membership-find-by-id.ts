import { AccountMembership } from '../../entities/account-membership.entity';
import { AccountMembershipNotFoundException } from '../../exceptions/account';
import { IAccountMembershipRepository } from '../../repositories/account-membership.repository';

interface Props {
  id: string;
  onlyActive: boolean;
}

export class AccountMembershipFindById {
  constructor(private readonly repository: IAccountMembershipRepository) {}

  async execute({ id, onlyActive }: Props): Promise<AccountMembership | null> {
    const accountMembership = await this.repository.findById(id);

    if (onlyActive && accountMembership && !accountMembership.isActive()) return null;

    return accountMembership;
  }

  async executeOrFail({ id, onlyActive }: Props): Promise<AccountMembership> {
    const accountMembership = await this.repository.findById(id);

    if (!accountMembership) throw new AccountMembershipNotFoundException();

    if (onlyActive && !accountMembership.isActive()) throw new AccountMembershipNotFoundException();

    return accountMembership;
  }
}
