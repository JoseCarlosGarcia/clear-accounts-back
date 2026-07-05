import { Command } from 'src/shared/application/interfaces/command.interface';
import { SignInRequest } from './requests/sign-in.request';
import { SignInResponse } from './responses/sign-in.response';
import { SignIn } from 'src/authentication/domain/services/sign-in';
import { UserResponseMapper } from 'src/user/application/mappers/user-response-mapper';

export class SignInCommand implements Command<SignInRequest, SignInResponse> {
  constructor(private readonly service: SignIn) {}
  async execute(request: SignInRequest): Promise<SignInResponse> {
    const result = await this.service.execute({
      email: request.email,
      password: request.password,
    });

    return {
      user: UserResponseMapper.toResponse(result.user),
      accessToken: result.accessToken,
    };
  }
}
