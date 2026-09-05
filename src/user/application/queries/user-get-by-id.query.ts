import { UserResponse } from './responses/user.response';
import { UserResponseMapper } from '../mappers/user-response-mapper';
import { UserFindById } from 'src/user/domain/services/user-find-by-id';
import { UserGetByIdRequest } from './requests/user-get-by-id.request';
import { Query } from 'src/shared/application/interfaces/queries.interface';

export class UserGetById
  implements Query<UserGetByIdRequest, Promise<UserResponse>>
{
  constructor(private readonly service: UserFindById) {}

  async execute({ id }: UserGetByIdRequest): Promise<UserResponse> {
    const user = await this.service.executeOrFail({ id, onlyActive: true });

    return UserResponseMapper.toResponse(user);
  }
}

