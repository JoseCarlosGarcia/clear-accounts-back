import { User } from '../entities/user.entity';
import { IUserRepository } from '../repositories/user.repository';

interface Props {
  email: string;
}

export class UserFindByEmail {
  constructor(private readonly repository: IUserRepository) {}

  async execute({ email }: Props): Promise<User | null> {
    const found = await this.repository.findByEmail(email);
    return found;
  }
}
