import { Account } from '../../entities/account.entity';
import { AccountAlreadyActiveException } from '../../exceptions/account';
import { IAccountRepository } from '../../repositories/account.repository';
import { AccountFindById } from './account-find-by-id';

interface Props {
  id: string;
}

export class AccountRestore {
  constructor(
    private readonly repository: IAccountRepository,
    private readonly findAccount: AccountFindById,
  ) {}

  async execute({ id }: Props): Promise<Account> {
    const account = await this.findAccount.executeOrFail({
      id: id,
      onlyActive: false,
    });

    if (account.isActive()) throw new AccountAlreadyActiveException();

    account.restore();
    await this.repository.update(account);
    return account;
  }
}
