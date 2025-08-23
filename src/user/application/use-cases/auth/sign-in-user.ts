import { IUserRepository } from 'src/user/domain/repository/user';
import { SignInDTO } from '../../dto/write/dto/sign-in';
import { AccessTokenCreator } from 'src/user/domain/services/access-token-creator';
import { PasswordCompare } from 'src/user/domain/services/password-compare';
import { SignInResponse } from '../../dto/read/sign-in';
import { NotFoundUserException } from 'src/user/domain/exceptions/user';

interface Props {
  dto: SignInDTO;
}

export class SignInUser {
  constructor(
    private readonly repository: IUserRepository,
    private readonly accessTokenCreator: AccessTokenCreator,
    private readonly comparator: PasswordCompare,
  ) {}

  async execute({ dto }: Props): Promise<SignInResponse> {
    const user = await this.repository.findByEmail(dto.email);
    
    if (user && !user.deleted) {
      const equal = await this.comparator.execute({
        compare: dto.password,
        hashed: user.password,
      });

      const accessToken = this.accessTokenCreator.execute({ id: user.id });

      if (equal) {
        return {
          email: user.email,
          id: user.id,
          accessToken: accessToken,
          name: user.name,
        };
      }
    }

    throw new NotFoundUserException();
  }
}

