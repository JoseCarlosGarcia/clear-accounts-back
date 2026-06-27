import { User } from 'src/user/domain/entities/user.entity';
import { UserModel } from '../models/user.model';

export class UserMapper {
  constructor() {}

  static toDomain(u: UserModel): User {
    return new User({
      email: u.email,
      id: u.id,
      password: u.password || '',
      active: u.deleted,
      name: u.name,
    });
  }

  static toModel(user: User): UserModel{
    const model = new UserModel();
    model.id = user.getId();
    model.email = user.getEmail();
    model.name = user.getName();
    model.password = user.getPassword();
    return model;
  }

  static toDomainList(models: UserModel[]): User[] {
    return models.map((model) => this.toDomain(model));
  }

  static toModelList(domains: User[]): UserModel[] {
    return domains.map((domain) => this.toModel(domain));
  }
}

