import { Query } from 'src/shared/application/interfaces/queries.interface';
import { AccountGetByIdRequest } from './requests/account-get-by-id.request';
import { AccountResponse } from './responses/account.response';
import { AccountFindById } from 'src/account/domain/services/account/account-find-by-id';
import { AccountResponseMapper } from '../../mappers/account-response-mapper';
import { EnsureAccountMember } from 'src/authorization/domain/services/account-access/ensure-account-member';
import { User } from 'src/user/domain/entities/user.entity';

interface Props {
  request: AccountGetByIdRequest;
  user: User;
}

export class AccountGetById implements Query<Props, Promise<AccountResponse>> {
  constructor(
    private readonly service: AccountFindById,
    private readonly ensureAccountMember: EnsureAccountMember,
  ) {}

  async execute({ request, user }: Props): Promise<AccountResponse> {
    await this.ensureAccountMember.executeOrFail({
      userId: user.getId(),
      accountId: request.id,
    });

    const account = await this.service.executeOrFail({
      id: request.id,
      onlyActive: true,
    });

    return AccountResponseMapper.toResponse(account);
  }
}
