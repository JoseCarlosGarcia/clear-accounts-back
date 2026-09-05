import { User } from '../entities/user.entity';
import { UserNotFoundException } from '../exceptions/user';
import { IUserRepository } from '../repositories/user.repository';

interface Props {
  id: string;
  onlyActive: boolean;
}

export class UserFindById {
  constructor(private readonly repository: IUserRepository) {}

  async execute({ id, onlyActive }: Props): Promise<User | null> {
    const user = await this.repository.findById(id);

    if(user && onlyActive && !user.isActive()) return null;
    return user;
  }

  async executeOrFail({ id, onlyActive }: Props): Promise<User> {
    const user = await this.repository.findById(id);

    if(!user) throw new UserNotFoundException();

    if(onlyActive && !user.isActive()) throw new UserNotFoundException();
    return user;
  }
}
