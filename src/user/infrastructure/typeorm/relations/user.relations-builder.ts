import { FindOptionsRelations } from 'typeorm';
import { UserModel } from '../models/user.model';

export class UserRelationsBuilder {
  static build(): FindOptionsRelations<UserModel> {
    return {};
  }
}
