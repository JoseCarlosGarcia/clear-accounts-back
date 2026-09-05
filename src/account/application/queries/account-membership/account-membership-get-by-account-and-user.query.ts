import { Query } from 'src/shared/application/interfaces/queries.interface';
import { User } from 'src/user/domain/entities/user.entity';
import { AccountMembershipFindByAccountAndUser } from 'src/account/domain/services/account-membership/account-membership-find-by-account-and-user';
import { EnsureAccountMember } from 'src/authorization/domain/services/account-access/ensure-account-member';
import { AccountMemberResponse } from './responses/account-member.response';
import { AccountMemberResponseMapper } from '../../mappers/account-member-response-mapper';

interface Props {
  accountId: string;
  userId: string;
  user: User;
}

export class AccountMembershipGetByAccountAndUser
  implements Query<Props, Promise<AccountMemberResponse>>
{
  constructor(
    private readonly findAccountMembership: AccountMembershipFindByAccountAndUser,
    private readonly ensureAccountMember: EnsureAccountMember,
  ) {}

  async execute({
    accountId,
    userId,
    user,
  }: Props): Promise<AccountMemberResponse> {
    await this.ensureAccountMember.executeOrFail({
      userId: user.getId(),
      accountId: accountId,
    });

    const accountMembership = await this.findAccountMembership.executeOrFail({
      accountId: accountId,
      userId: userId,
      onlyActive: true,
    });

    return AccountMemberResponseMapper.toResponse(accountMembership);
  }
}
