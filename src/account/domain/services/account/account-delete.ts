import { Account } from '../../entities/account.entity';
import { IAccountRepository } from '../../repositories/account.repository';
import { AccountFindById } from './account-find-by-id';

interface Props {
  id: string;
}

export class AccountDelete {
  constructor(
    private readonly repository: IAccountRepository,
    private readonly findAccount: AccountFindById,
  ) {}

  async execute({ id }: Props): Promise<Account> {
    const account = await this.findAccount.executeOrFail({
      id: id,
      onlyActive: true,
    });
    account.delete();
    await this.repository.update(account);
    return account;
  }
}
