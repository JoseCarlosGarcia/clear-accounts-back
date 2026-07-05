import { NotEqualPasswordsException } from '../exceptions/user';
import { User } from '../entities/user.entity';
import { PasswordHasher } from 'src/authentication/domain/interfaces/password-hasher';
import { IUserRepository } from '../repositories/user.repository';

export interface UpdateUserProps {
  user: User;
  oldPassword: string;
  newPassword: string;
}

export class UserChangePassword {
  constructor(
    private readonly repository: IUserRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute({ user, oldPassword, newPassword }: UpdateUserProps): Promise<User> {
    const equal = await this.hasher.compare(oldPassword, user.password);

    if (!equal) throw new NotEqualPasswordsException();

    const password = await this.hasher.hash(newPassword);
    user.setPassword(password);

    await this.repository.updatePassword(user);
    return user;
  }
}
