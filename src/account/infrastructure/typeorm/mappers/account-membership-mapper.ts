import { AccountMembership } from "src/account/domain/entities/account-membership.entity";
import { AccountMembershipModel } from "../models/account-membership.model";
import { UserMapper } from "src/user/infrastructure/typeorm/mappers/user-mapper";

export class AccountMembershipMapper {
  constructor() {}

  static toDomain(model: AccountMembershipModel): AccountMembership {
    return new AccountMembership({
      id: model.id,
      accountId: model.account_id,
      role: model.role,
      user: UserMapper.toDomain(model.user),
      createdAt: model.createdAt,
      active: model.active,
    });
  }

  static toModel(domain: AccountMembership): AccountMembershipModel{
    const model = new AccountMembershipModel();
    model.id = domain.getId();
    model.account_id = domain.getAccountId();
    model.user_id = domain.getUserId();
    model.role = domain.getRole();
    model.active = domain.isActive();
    return model;
  }

  static toDomainList(models: AccountMembershipModel[]): AccountMembership[] {
    return models.map((model) => this.toDomain(model));
  }

  static toModelList(domains: AccountMembership[]): AccountMembershipModel[] {
    return domains.map((domain) => this.toModel(domain));
  }
}

