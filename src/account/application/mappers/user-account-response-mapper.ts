import { AccountMembership } from 'src/account/domain/entities/account-membership.entity';
import { UserAccountResponse } from '../queries/account/responses/user-account.response';
import { AccountResponseMapper } from './account-response-mapper';

export class UserAccountResponseMapper {
  static toResponse(m: AccountMembership): UserAccountResponse {
    return {
      ...AccountResponseMapper.toResponse(m.account),
      role: m.getRole(),
    };
  }

  static toResponseList(
    memberships: AccountMembership[],
  ): UserAccountResponse[] {
    return memberships.map((m) => this.toResponse(m));
  }
}
