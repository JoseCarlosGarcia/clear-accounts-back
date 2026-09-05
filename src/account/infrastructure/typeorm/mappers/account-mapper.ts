import { UserMapper } from "src/user/infrastructure/typeorm/mappers/user-mapper";
import { AccountModel } from "../models/account.model";
import { Account } from "src/account/domain/entities/account.entity";

export class AccountMapper {
  constructor() {}

  static toDomain(model: AccountModel): Account {
    return new Account({
      id: model.id,
      color: model.color,
      initialBalance: model.initialBalance,
      name: model.name,
      createdBy: UserMapper.toDomain(model.createdBy),
      createdAt: model.createdAt,
      active: model.active,
    });
  }

  static toModel(domain: Account): AccountModel{
    const model = new AccountModel();
    model.id = domain.getId();
    model.name = domain.getName();
    model.color = domain.getColor();
    model.initialBalance = domain.getInitialBalance();
    model.created_by_id = domain.getCreatedById();
    model.active = domain.isActive();
    return model;
  }

  static toDomainList(models: AccountModel[]): Account[] {
    return models.map((model) => this.toDomain(model));
  }

  static toModelList(domains: Account[]): AccountModel[] {
    return domains.map((domain) => this.toModel(domain));
  }
}

