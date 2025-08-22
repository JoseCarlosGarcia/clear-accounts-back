import { IUserRepository } from 'src/user/domain/repository/user';
import { UserResponse } from '../../dto/read/user';
import { UserResponseMapper } from 'src/user/domain/services/user-response-mapper';
import { NotFoundUserException } from 'src/user/domain/exceptions/user';

interface Props {
  id: number;
}

export class GetUserById {
  constructor(private readonly repository: IUserRepository) {}

  async execute({ id }: Props): Promise<UserResponse> {
    const found = await this.repository.findById(id);

    if (found && !found.deleted) {
      return UserResponseMapper.execute(found);
    }

    throw new NotFoundUserException();
  }
}

