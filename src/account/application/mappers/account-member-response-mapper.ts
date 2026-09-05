import { AccountMembership } from 'src/account/domain/entities/account-membership.entity';
import { UserResponseMapper } from 'src/user/application/mappers/user-response-mapper';
import { AccountMemberResponse } from '../queries/account-membership/responses/account-member.response';

export class AccountMemberResponseMapper {
  static toResponse(m: AccountMembership): AccountMemberResponse {
    return {
      id: m.getId(),
      createdAt: m.getCreatedAt(),
      user: UserResponseMapper.toResponse(m.getUser()),
      role: m.getRole(),
      active: m.isActive(),
    };
  }

  static toResponseList(
    memberships: AccountMembership[],
  ): AccountMemberResponse[] {
    return memberships.map((m) => this.toResponse(m));
  }
}
