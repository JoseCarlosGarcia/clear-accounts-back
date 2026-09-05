import { FindOptionsRelations } from 'typeorm';
import { AccountModel } from '../models/account.model';

export class AccountRelationsBuilder {
  static build(): FindOptionsRelations<AccountModel> {
    return {
      createdBy: true,
    };
  }
}
