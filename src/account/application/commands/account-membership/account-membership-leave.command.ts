import { Command } from 'src/shared/application/interfaces/command.interface';
import { User } from 'src/user/domain/entities/user.entity';
import { AccountFindById } from 'src/account/domain/services/account/account-find-by-id';
import { AccountMembershipDelete } from 'src/account/domain/services/account-membership/account-membership-delete';
import { EnsureAccountMember } from 'src/authorization/domain/services/account-access/ensure-account-member';
import { AccountMemberResponse } from '../../queries/account-membership/responses/account-member.response';
import { AccountMemberResponseMapper } from '../../mappers/account-member-response-mapper';

interface Props {
  accountId: string;
  user: User;
}

export class AccountMembershipLeaveCommand
  implements Command<Props, AccountMemberResponse>
{
  constructor(
    private readonly service: AccountMembershipDelete,
    private readonly findAccount: AccountFindById,
    private readonly ensureAccountMember: EnsureAccountMember,
  ) {}

  async execute({ accountId, user }: Props): Promise<AccountMemberResponse> {
    const accountMembership = await this.ensureAccountMember.executeOrFail({
      userId: user.getId(),
      accountId: accountId,
    });

    await this.findAccount.executeOrFail({ id: accountId, onlyActive: true });

    const left = await this.service.execute({
      id: accountMembership.getId(),
      accountMembership: accountMembership,
    });

    return AccountMemberResponseMapper.toResponse(left);
  }
}
