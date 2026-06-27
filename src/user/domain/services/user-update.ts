import { RepeatUserException } from '../exceptions/user';
import { IUserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';

export interface UpdateUserProps {
  user: User;
  name?: string;
  email?: string;
}

export class UserUpdate {
  constructor(private readonly repository: IUserRepository) {}

  async execute({ user, email, name }: UpdateUserProps): Promise<User> {
    if (email !== undefined) {
      const found = await this.repository.findByEmail(email);
      if (found && found.getId() !== user.getId()) {
        throw new RepeatUserException();
      }
      user.setEmail(email);
    }

    if (name !== undefined) {
      user.setName(name);
    }

    await this.repository.update(user);
    return user;
  }
}
