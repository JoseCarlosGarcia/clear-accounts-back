import { UserResponse } from 'src/user/application/dto/read/user';
import { User } from '../entities/user';

export class UserResponseMapper {
  static execute(u: User): UserResponse {
    return {
      id: u.id,
      birthday: u.birthday,
      email: u.email,
      name: u.name,
      created_at: u.created_at,
    };
  }
}

