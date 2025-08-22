import { UserCreator } from 'src/user/domain/services/user-creator';
import { CreateUserDto } from '../../dto/write/dto/create-user';

interface Props {
  dto: CreateUserDto;
}

export class CreateUser {
  constructor(private readonly creator: UserCreator) {}

  async execute({ dto }: Props): Promise<void> {
    await this.creator.execute({
      birthday: dto.birthday,
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });
  }
}

