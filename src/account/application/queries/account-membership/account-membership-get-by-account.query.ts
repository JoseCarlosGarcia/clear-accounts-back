import { Query } from 'src/shared/application/interfaces/queries.interface';
import { PaginationResponseMapper } from 'src/shared/application/mappers/pagination-mapper';
import { PaginationResponse } from 'src/shared/application/responses/pagination.response';
import { IAccountMembershipRepository } from 'src/account/domain/repositories/account-membership.repository';
import { EnsureAccountMember } from 'src/authorization/domain/services/account-access/ensure-account-member';
import { User } from 'src/user/domain/entities/user.entity';
import { AccountMembershipGetByAccountRequest } from './requests/account-membership-get-by-account.request';
import { AccountMemberResponse } from './responses/account-member.response';
import { AccountMemberResponseMapper } from '../../mappers/account-member-response-mapper';

interface Props {
  request: AccountMembershipGetByAccountRequest;
  accountId: string;
  user: User;
}

export class AccountMembershipGetByAccount
  implements Query<Props, Promise<PaginationResponse<AccountMemberResponse>>>
{
  constructor(
    private readonly repository: IAccountMembershipRepository,
    private readonly ensureAccountMember: EnsureAccountMember,
  ) {}

  async execute({
    request,
    accountId,
    user,
  }: Props): Promise<PaginationResponse<AccountMemberResponse>> {
    await this.ensureAccountMember.executeOrFail({
      userId: user.getId(),
      accountId: accountId,
    });

    const members = await this.repository.find({
      accountId: accountId,
      accountRole: request.role,
      isActive: request.active ?? true,
      page: request.page,
      pageSize: request.pageSize,
      sort: request.sort,
    });

    return PaginationResponseMapper.toResponse({
      items: AccountMemberResponseMapper.toResponseList(members.items),
      totalItems: members.totalItems,
      totalPages: members.pagination.totalPages,
      pageSize: members.pagination.pageSize,
      hasNextPage: members.pagination.hasNextPage,
    });
  }
}
