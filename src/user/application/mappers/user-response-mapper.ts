import { UserResponse } from 'src/user/application/queries/responses/user.response';
import { User } from 'src/user/domain/entities/user.entity';

export class UserResponseMapper {
  static toResponse(u: User): UserResponse {
    return {
      id: u.getId(),
      email: u.getEmail(),
      name: u.getName(),
      createdAt: u.getCreatedAt(),
    };
  }

  static toResponseList(users: User[]): UserResponse[] {
    return users.map((user) => this.toResponse(user));
  }
}

