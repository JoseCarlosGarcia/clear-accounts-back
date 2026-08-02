import { Account } from '../../entities/account.entity';
import { IAccountRepository } from '../../repositories/account.repository';
import { AccountFindById } from './account-find-by-id';

interface Props {
  id: string;
  name?: string;
  initialBalance?: number;
  color?: string;
  account?: Account;
}

export class AccountUpdate {
  constructor(
    private readonly repository: IAccountRepository,
    private readonly findAccount: AccountFindById,
  ) {}

  async execute(props: Props): Promise<Account> {
    const account = props.account ?? await this.findAccount.executeOrFail({
      id: props.id,
      isActive: true,
    });

    if (props.name !== undefined) {
      account.setName(props.name);
    }
    if (props.color !== undefined) {
      account.setColor(props.color);
    }
    if (props.initialBalance !== undefined) {
      account.setInitialBalance(props.initialBalance);
    }

    await this.repository.update(account);
    return account;
  }
}
