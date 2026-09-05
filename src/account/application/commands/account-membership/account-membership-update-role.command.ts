import { Command } from 'src/shared/application/interfaces/command.interface';
import { User } from 'src/user/domain/entities/user.entity';
import { AccountRole } from 'src/account/domain/enums/account-role';
import { AccountFindById } from 'src/account/domain/services/account/account-find-by-id';
import { AccountMembershipFindByAccountAndUser } from 'src/account/domain/services/account-membership/account-membership-find-by-account-and-user';
import { AccountMembershipUpdateRole } from 'src/account/domain/services/account-membership/account-membership-update-role';
import { EnsureAccountRole } from 'src/authorization/domain/services/account-access/ensure-account-role';
import { AccountMemberResponse } from '../../queries/account-membership/responses/account-member.response';
import { AccountMemberResponseMapper } from '../../mappers/account-member-response-mapper';
import { AccountMembershipUpdateRoleRequest } from './requests/account-membership-update-role.request';

interface Props {
  request: AccountMembershipUpdateRoleRequest;
  accountId: string;
  userId: string;
  user: User;
}

export class AccountMembershipUpdateRoleCommand
  implements Command<Props, AccountMemberResponse>
{
  constructor(
    private readonly service: AccountMembershipUpdateRole,
    private readonly findAccountMembership: AccountMembershipFindByAccountAndUser,
    private readonly findAccount: AccountFindById,
    private readonly ensureAccountRole: EnsureAccountRole,
  ) {}

  async execute({
    request,
    accountId,
    userId,
    user,
  }: Props): Promise<AccountMemberResponse> {
    await this.ensureAccountRole.executeOrFail({
      userId: user.getId(),
      accountId: accountId,
      role: AccountRole.OWNER,
    });

    await this.findAccount.executeOrFail({ id: accountId, onlyActive: true });

    const accountMembership = await this.findAccountMembership.executeOrFail({
      accountId: accountId,
      userId: userId,
      onlyActive: true,
    });

    const updated = await this.service.execute({
      id: accountMembership.getId(),
      accountMembership: accountMembership,
      role: request.role,
    });

    return AccountMemberResponseMapper.toResponse(updated);
  }
}
