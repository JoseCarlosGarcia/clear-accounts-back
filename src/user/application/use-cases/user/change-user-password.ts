import { User } from 'src/user/domain/entities/user';
import { ChangePasswordDTO } from '../../dto/write/change-password';
import { UserPostgresRepository } from 'src/user/infrastructure/postgres/repository/user';
import { PasswordCrypt } from 'src/user/domain/services/password-crypt';
import { PasswordCompare } from 'src/user/domain/services/password-compare';
import { NotEqualPasswordsException } from 'src/user/domain/exceptions/user';

interface Props {
  dto: ChangePasswordDTO;
  user: User;
}

export class ChangeUserPassword {
  constructor(
    private readonly repository: UserPostgresRepository,
    private readonly hasher: PasswordCrypt,
    private readonly comparator: PasswordCompare,
  ) {}

  async execute({ dto, user }: Props): Promise<void> {
    const equal = await this.comparator.execute({
      compare: dto.oldPassword,
      hashed: user.password,
    });

    if (equal) {
      const password = await this.hasher.execute({ password: dto.password });

      user.password = password;

      await this.repository.update(user);
    } else {
      throw new NotEqualPasswordsException();
    }
  }
}
