import { IUserRepository } from 'src/user/domain/repositories/user.repository';
import { UnauthorizedException } from '@nestjs/common';
import { UserNotFoundException } from 'src/user/domain/exceptions/user';
import { User } from 'src/user/domain/entities/user.entity';
import { TokenService } from '../interfaces/token-service';
import { PasswordHasher } from '../interfaces/password-hasher';

interface SignInProps {
  email: string;
  password: string;
}

interface SignInResult {
  user: User;
  accessToken: string;
}

export class SignIn {
  constructor(
    private readonly repository: IUserRepository,
    private readonly tokenService: TokenService,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute({ email, password }: SignInProps): Promise<SignInResult> {
    const user = await this.repository.findByEmailWithPassword(email);

    if (!user || !user.isActive()) throw new UserNotFoundException();

    const equal = await this.passwordHasher.compare(password, user.getPassword());

    if (!equal) throw new UnauthorizedException();

    const accessToken = this.tokenService.sign({ id: user.id });

    return {
      user: user,
      accessToken: accessToken,
    };
  }
}
