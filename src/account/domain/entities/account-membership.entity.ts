import { User } from 'src/user/domain/entities/user.entity';
import { AccountRole } from '../enums/account-role';
import { Account } from './account.entity';

export interface AccountMembershipProps {
  id: string;
  account: Account;
  user: User;
  role: AccountRole;
  active: boolean;
  createdAt?: Date;
}

export class AccountMembership {
  readonly id: string;
  readonly createdAt: Date;
  account: Account;
  user: User;
  role: AccountRole;
  active: boolean;

  constructor(props: AccountMembershipProps) {
    this.id = props.id;
    this.account = props.account;
    this.createdAt = props.createdAt ?? new Date();
    this.user = props.user;
    this.role = props.role;
    this.active = props.active;
  }

  getId(): string {
    return this.id;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getAccountId(): string {
    return this.account.getId();
  }

  getUser(): User {
    return this.user;
  }

  getRole(): AccountRole {
    return this.role;
  }

  getUserId(): string {
    return this.user.getId();
  }

  isOwner(): boolean {
    return this.role === AccountRole.OWNER;
  }

  isActive(): boolean {
    return this.active;
  }

  setRole(role: AccountRole) {
    this.role = role;
  }

  delete() {
    this.active = false;
  }

  restore() {
    this.active = true;
  }
}
