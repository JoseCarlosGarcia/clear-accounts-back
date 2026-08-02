import { Account } from "../../entities/account.entity";
import { AccountNotFoundException } from "../../exceptions/account";
import { IAccountRepository } from "../../repositories/account.repository";

interface Props {
  id: string;
  isActive: boolean;
}

export class AccountFindById {
  constructor(private readonly repository: IAccountRepository) {}

  async execute({ id, isActive }: Props): Promise<Account | null> {
    const account = await this.repository.findById(id);

    if(isActive && !account.isActive()) return null;

    return account;
  }

  async executeOrFail({ id, isActive }: Props): Promise<Account> {
    const account = await this.repository.findById(id);

    if(!account) throw new AccountNotFoundException();

    if(isActive && !account.isActive()) throw new AccountNotFoundException();

    return account;
  }

}
