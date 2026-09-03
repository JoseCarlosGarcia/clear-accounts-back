import { User } from '../entities/user.entity';
import { UserNotFoundException } from '../exceptions/user';
import { IUserRepository } from '../repositories/user.repository';

interface Props {
  id: string;
  isActive: boolean;
}

export class UserFindById {
  constructor(private readonly repository: IUserRepository) {}

  async execute({ id, isActive }: Props): Promise<User | null> {
    const user = await this.repository.findById(id);

    if(user && isActive && !user.isActive()) return null;
    return user;
  }

  async executeOrFail({ id, isActive }: Props): Promise<User> {
    const user = await this.repository.findById(id);

    if(!user) throw new UserNotFoundException();

    if(isActive && !user.isActive()) throw new UserNotFoundException();
    return user;
  }
}
