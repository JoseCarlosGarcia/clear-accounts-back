import { Command } from 'src/shared/application/interfaces/command.interface';
import { User } from 'src/user/domain/entities/user.entity';
import { AccountUpdate } from 'src/account/domain/services/account/account-update';
import { EnsureAccountMember } from 'src/authorization/domain/services/account-access/ensure-account-member';
import { AccountResponse } from '../../queries/account/responses/account.response';
import { AccountResponseMapper } from '../../mappers/account-response-mapper';
import { AccountUpdateRequest } from './requests/account-update.request';

interface Props {
  request: AccountUpdateRequest;
  id: string;
  user: User;
}

export class AccountUpdateCommand implements Command<Props, AccountResponse> {
  constructor(
    private readonly service: AccountUpdate,
    private readonly ensureAccountMember: EnsureAccountMember,
  ) {}

  async execute({ request, id, user }: Props): Promise<AccountResponse> {
    await this.ensureAccountMember.executeOrFail({
      userId: user.getId(),
      accountId: id,
    });

    const account = await this.service.execute({
      id: id,
      name: request.name,
      color: request.color,
      initialBalance: request.initialBalance,
    });

    return AccountResponseMapper.toResponse(account);
  }
}
