import { User } from '../entities/user.entity';
import { UserNotFoundException } from '../exceptions/user';
import { IUserRepository } from '../repositories/user.repository';

interface Props {
  id: string;
}

export class UserFindById {
  constructor(private readonly repository: IUserRepository) {}

  async execute({ id }: Props): Promise<User | null> {
    const found = await this.repository.findById(id);
    return found;
  }

  async executeOrFail({ id }: Props): Promise<User> {
    const found = await this.repository.findById(id);

    if(!found) throw new UserNotFoundException();
    return found;
  }
}
