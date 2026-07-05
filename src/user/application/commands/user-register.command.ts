import { UserCreate } from 'src/user/domain/services/user-create';
import { TokenService } from 'src/authentication/domain/interfaces/token-service';
import { CreateUserRequest } from './requests/create-user.request';
import { Command } from 'src/shared/application/interfaces/command.interface';
import { SignInResponse } from 'src/authentication/application/commands/responses/sign-in.response';
import { UserResponseMapper } from '../mappers/user-response-mapper';

interface Props {
  request: CreateUserRequest;
}

export class UserRegisterCommand implements Command<Props, SignInResponse>{
  constructor(
    private readonly creator: UserCreate,
    private readonly tokenService: TokenService,
  ) {}

  async execute({ request }: Props): Promise<SignInResponse> {
    const user = await this.creator.execute({
      email: request.email,
      name: request.name,
      password: request.password,
    });

    const accessToken = this.tokenService.sign({ id: user.id });

    return {
      user: UserResponseMapper.toResponse(user),
      accessToken,
    };
  }
}
