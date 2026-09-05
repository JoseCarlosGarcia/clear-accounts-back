import { FindOptionsRelations } from 'typeorm';
import { AccountMembershipModel } from '../models/account-membership.model';
import { UserRelationsBuilder } from 'src/user/infrastructure/typeorm/relations/user.relations-builder';
import { AccountRelationsBuilder } from './account.relations-builder';

export class AccountMembershipRelationsBuilder {
  static build(): FindOptionsRelations<AccountMembershipModel> {
    return {
      user: UserRelationsBuilder.build(),
      account: AccountRelationsBuilder.build(),
    };
  }
}
