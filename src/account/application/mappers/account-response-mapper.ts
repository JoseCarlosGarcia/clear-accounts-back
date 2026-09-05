import { Account } from 'src/account/domain/entities/account.entity';
import { AccountResponse } from '../queries/account/responses/account.response';
import { UserResponseMapper } from 'src/user/application/mappers/user-response-mapper';

export class AccountResponseMapper {
  static toResponse(a: Account): AccountResponse {
    return {
      id: a.getId(),
      createdAt: a.getCreatedAt(),
      name: a.getName(),
      active: a.isActive(),
      color: a.getColor(),
      initialBalance: a.getInitialBalance(),
      createdBy: UserResponseMapper.toResponse(a.createdBy),
    };
  }

  static toResponseList(accounts: Account[]): AccountResponse[] {
    return accounts.map((a) => this.toResponse(a));
  }
}

