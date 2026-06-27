import { UserCreate } from 'src/user/domain/services/user-create';
import { AccessTokenCreator } from 'src/user/domain/services/access-token-creator';
import { CreateUserRequest } from './requests/create-user.request';
import { SignInResponse } from '../use-cases/auth/responses/sign-in';

interface Props {
  request: CreateUserRequest;
}

export class UserRegisterCommand {
  constructor(
    private readonly creator: UserCreate,
    private readonly accessTokenCreator: AccessTokenCreator,
  ) {}

  async execute({ request }: Props): Promise<SignInResponse> {
    const user = await this.creator.execute({
      email: request.email,
      name: request.name,
      password: request.password,
    });

    const accessToken = this.accessTokenCreator.execute({ id: user.id });

    return {
      id: user.getId(),
      email: user.getEmail(),
      name: user.getName(),
      accessToken,
    };
  }
}
