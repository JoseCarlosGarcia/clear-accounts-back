import { AccountMembership } from '../../entities/account-membership.entity';
import { AccountRole } from '../../enums/account-role';
import { IAccountMembershipRepository } from '../../repositories/account-membership.repository';
import { AccountMembershipFindById } from './account-membership-find-by-id';
import { AccountMembershipUpdateOwners } from './account-membership-update-owners';

interface Props {
  id: string;
  accountMembership?: AccountMembership;
  role: AccountRole;
}

export class AccountMembershipUpdateRole {
  constructor(
    private readonly repository: IAccountMembershipRepository,
    private readonly findAccountMembership: AccountMembershipFindById,
    private readonly updateOwners: AccountMembershipUpdateOwners,
  ) {}

  async execute(props: Props): Promise<AccountMembership> {
    const accountMembership =
      props.accountMembership ??
      (await this.findAccountMembership.executeOrFail({
        id: props.id,
        isActive: true,
      }));

    if (accountMembership.getRole() === props.role) return accountMembership;

    if (props.role !== AccountRole.OWNER) {
      await this.updateOwners.execute({ accountMembership });
    }

    accountMembership.setRole(props.role);
    await this.repository.update(accountMembership);
    return accountMembership;
  }
}
