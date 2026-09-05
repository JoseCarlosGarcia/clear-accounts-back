import { Command } from 'src/shared/application/interfaces/command.interface';
import { User } from 'src/user/domain/entities/user.entity';
import { AccountRole } from 'src/account/domain/enums/account-role';
import { AccountFindById } from 'src/account/domain/services/account/account-find-by-id';
import { AccountMembershipDelete } from 'src/account/domain/services/account-membership/account-membership-delete';
import { AccountMembershipFindByAccountAndUser } from 'src/account/domain/services/account-membership/account-membership-find-by-account-and-user';
import { EnsureAccountRole } from 'src/authorization/domain/services/account-access/ensure-account-role';
import { AccountMemberResponse } from '../../queries/account-membership/responses/account-member.response';
import { AccountMemberResponseMapper } from '../../mappers/account-member-response-mapper';

interface Props {
  accountId: string;
  userId: string;
  user: User;
}

export class AccountMembershipRemoveCommand
  implements Command<Props, AccountMemberResponse>
{
  constructor(
    private readonly service: AccountMembershipDelete,
    private readonly findAccountMembership: AccountMembershipFindByAccountAndUser,
    private readonly findAccount: AccountFindById,
    private readonly ensureAccountRole: EnsureAccountRole,
  ) {}

  async execute({
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

    const removed = await this.service.execute({
      id: accountMembership.getId(),
      accountMembership: accountMembership,
    });

    return AccountMemberResponseMapper.toResponse(removed);
  }
}
