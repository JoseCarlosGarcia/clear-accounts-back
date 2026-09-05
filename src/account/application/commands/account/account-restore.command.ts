import { Command } from 'src/shared/application/interfaces/command.interface';
import { User } from 'src/user/domain/entities/user.entity';
import { AccountRestore } from 'src/account/domain/services/account/account-restore';
import { AccountRole } from 'src/account/domain/enums/account-role';
import { EnsureAccountRole } from 'src/authorization/domain/services/account-access/ensure-account-role';
import { AccountResponse } from '../../queries/account/responses/account.response';
import { AccountResponseMapper } from '../../mappers/account-response-mapper';

interface Props {
  id: string;
  user: User;
}

export class AccountRestoreCommand implements Command<Props, AccountResponse> {
  constructor(
    private readonly service: AccountRestore,
    private readonly ensureAccountRole: EnsureAccountRole,
  ) {}

  async execute({ id, user }: Props): Promise<AccountResponse> {
    await this.ensureAccountRole.executeOrFail({
      userId: user.getId(),
      accountId: id,
      role: AccountRole.OWNER,
    });

    const account = await this.service.execute({ id: id });

    return AccountResponseMapper.toResponse(account);
  }
}
