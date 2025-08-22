import { User } from '../entities/user';
import { IUserRepository } from '../repository/user';

interface Props {
  email: string;
}

export class FindUserByEmail {
  constructor(private readonly repository: IUserRepository) {}

  async execute({ email }: Props): Promise<User | null> {
    const found = await this.repository.findByEmail(email);
    return found;
  }
}
