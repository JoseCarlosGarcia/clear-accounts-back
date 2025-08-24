import { User } from 'src/user/domain/entities/user';
import { UserEntity } from '../entity/user.entity';

export class UserPostgresMapper {
  constructor() {}

  static execute(u: UserEntity): User {
    return new User({
      email: u.email,
      id: u.id,
      password: u.password,
      created_at: u.created_at,
      deleted: u.deleted,
      name: u.name,
    });
  }
}

