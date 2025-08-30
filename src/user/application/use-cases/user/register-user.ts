import { UserCreator } from 'src/user/domain/services/user-creator';
import { AccessTokenCreator } from 'src/user/domain/services/access-token-creator';
import { CreateUserDto } from '../../dto/write/create-user';
import { SignInResponse } from '../../dto/read/sign-in';

interface Props {
  dto: CreateUserDto;
}

export class RegisterUser {
  constructor(
    private readonly creator: UserCreator,
    private readonly accessTokenCreator: AccessTokenCreator,
  ) {}

  async execute({ dto }: Props): Promise<SignInResponse> {
    const id = await this.creator.execute({
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });

    const accessToken = this.accessTokenCreator.execute({ id });

    return {
      id: id,
      email: dto.email,
      name: dto.name,
      accessToken,
    };
  }
}
