import IdGenerator from 'src/shared/domain/interfaces/id.generator';
import { RepeatUserException } from '../exceptions/user';
import { PasswordCrypt } from './password-crypt';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../repositories/user.repository';

export interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}

export class UserCreate {
  constructor(
    private readonly repository: IUserRepository,
    private readonly idGenerator: IdGenerator,
    private readonly hasher: PasswordCrypt,
  ) {}

  async execute({ email, password, name }: CreateUserProps): Promise<User> {
    const found = await this.repository.findByEmail(email);

    if (found && found.isActive()) {
      throw new RepeatUserException();
    }

    const hashedpassword = await this.hasher.execute({ password: password });
    const user = new User({
      id: this.idGenerator.create(),
      email: email,
      name: name,
      password: hashedpassword,
      active: true,
      createdAt: new Date(),
    });
    await this.repository.save(user);
    return user;
  }
}
