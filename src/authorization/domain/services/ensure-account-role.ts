import { AccountMembership } from 'src/account/domain/entities/account-membership.entity';
import { EnsureAccountMember } from './ensure-account-member';
import { InsufficientAccountRoleException } from '../exceptions/account-access';
import { AccountRole } from 'src/account/domain/enums/account-role';

interface Props {
  userId: string;
  accountId: string;
  role: AccountRole;
}

export class EnsureAccountRole {
  constructor(private readonly ensureMember: EnsureAccountMember) {}

  async executeOrFail({ userId, accountId, role }: Props): Promise<AccountMembership> {
    const membership = await this.ensureMember.executeOrFail({ userId, accountId });

    if (membership.role !== role) throw new InsufficientAccountRoleException();

    return membership;
  }
}