import IdGenerator from 'src/shared/domain/interfaces/id.generator';
import { Account } from '../../entities/account.entity';
import { IAccountRepository } from '../../repositories/account.repository';
import { User } from 'src/user/domain/entities/user.entity';

interface Props {
  user: User;
  name: string;
  initialBalance: number;
  color?: string;
}

export class AccountCreate {
  constructor(
    private readonly repository: IAccountRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(props: Props): Promise<Account> {
    const account = new Account({
      id: this.idGenerator.create(),
      name: props.name,
      initialBalance: props.initialBalance,
      color: props.color ?? '#FFFFFF',
      createdAt: new Date(),
      createdBy: props.user,
      active: true
    });
    await this.repository.save(account);
    return account;
  }
}
