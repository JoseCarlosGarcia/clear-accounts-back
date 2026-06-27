import { NotEqualPasswordsException } from '../exceptions/user';
import { User } from '../entities/user.entity';
import { PasswordCrypt } from './password-crypt';
import { PasswordCompare } from './password-compare';
import { IUserRepository } from '../repositories/user.repository';

export interface UpdateUserProps {
  user: User;
  oldPassword: string;
  newPassword: string;
}

export class UserChangePassword {
  constructor(
    private readonly repository: IUserRepository,
    private readonly hasher: PasswordCrypt,
    private readonly comparator: PasswordCompare,
  ) {}

  async execute({ user, oldPassword, newPassword }: UpdateUserProps): Promise<User> {
    const equal = await this.comparator.execute({
      compare: oldPassword,
      hashed: user.password,
    });

    if (!equal) throw new NotEqualPasswordsException();
    
    const password = await this.hasher.execute({ password: newPassword });
    user.setPassword(password);

    await this.repository.update(user);
    return user;
  }
}
