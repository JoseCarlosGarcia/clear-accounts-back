import { Query } from 'src/shared/application/interfaces/queries.interface';
import { PaginationResponseMapper } from 'src/shared/application/mappers/pagination-mapper';
import { PaginationResponse } from 'src/shared/application/responses/pagination.response';
import { IAccountMembershipRepository } from 'src/account/domain/repositories/account-membership.repository';
import { User } from 'src/user/domain/entities/user.entity';
import { AccountGetByUserRequest } from './requests/account-get-by-user.request';
import { UserAccountResponse } from './responses/user-account.response';
import { UserAccountResponseMapper } from '../../mappers/user-account-response-mapper';

interface Props {
  request: AccountGetByUserRequest;
  user: User;
}

export class AccountGetByUser
  implements Query<Props, Promise<PaginationResponse<UserAccountResponse>>>
{
  constructor(private readonly repository: IAccountMembershipRepository) {}

  async execute({
    request,
    user,
  }: Props): Promise<PaginationResponse<UserAccountResponse>> {
    const memberships = await this.repository.find({
      userId: user.getId(),
      accountName: request.name,
      isActive: true,
      isAccountActive: request.active ?? true,
      page: request.page,
      pageSize: request.pageSize,
      sort: request.sort,
    });

    return PaginationResponseMapper.toResponse({
      items: UserAccountResponseMapper.toResponseList(memberships.items),
      totalItems: memberships.totalItems,
      totalPages: memberships.pagination.totalPages,
      pageSize: memberships.pagination.pageSize,
      hasNextPage: memberships.pagination.hasNextPage,
    });
  }
}
