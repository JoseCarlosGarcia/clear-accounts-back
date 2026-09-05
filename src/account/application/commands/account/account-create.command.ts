import { Command } from 'src/shared/application/interfaces/command.interface';
import { User } from 'src/user/domain/entities/user.entity';
import { AccountCreate } from 'src/account/domain/services/account/account-create';
import { AccountMembershipCreate } from 'src/account/domain/services/account-membership/account-membership-create';
import { AccountRole } from 'src/account/domain/enums/account-role';
import { AccountResponse } from '../../queries/account/responses/account.response';
import { AccountResponseMapper } from '../../mappers/account-response-mapper';
import { AccountCreateRequest } from './requests/account-create.request';

interface Props {
  request: AccountCreateRequest;
  user: User;
}

export class AccountCreateCommand implements Command<Props, AccountResponse> {
  constructor(
    private readonly accountCreate: AccountCreate,
    private readonly accountMembershipCreate: AccountMembershipCreate,
  ) {}

  async execute({ request, user }: Props): Promise<AccountResponse> {
    const account = await this.accountCreate.execute({
      user: user,
      name: request.name,
      initialBalance: request.initialBalance,
      color: request.color,
    });

    await this.accountMembershipCreate.execute({
      accountId: account.getId(),
      userId: user.getId(),
      role: AccountRole.OWNER,
    });

    return AccountResponseMapper.toResponse(account);
  }
}
