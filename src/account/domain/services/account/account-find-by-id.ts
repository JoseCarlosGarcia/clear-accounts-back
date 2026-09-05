import { Account } from "../../entities/account.entity";
import { AccountNotFoundException } from "../../exceptions/account";
import { IAccountRepository } from "../../repositories/account.repository";

interface Props {
  id: string;
  onlyActive: boolean;
}

export class AccountFindById {
  constructor(private readonly repository: IAccountRepository) {}

  async execute({ id, onlyActive }: Props): Promise<Account | null> {
    const account = await this.repository.findById(id);

    if(account && onlyActive && !account.isActive()) return null;

    return account;
  }

  async executeOrFail({ id, onlyActive }: Props): Promise<Account> {
    const account = await this.repository.findById(id);

    if(!account) throw new AccountNotFoundException();

    if(onlyActive && !account.isActive()) throw new AccountNotFoundException();

    return account;
  }

}
