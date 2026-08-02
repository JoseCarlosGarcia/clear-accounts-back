import { User } from "src/user/domain/entities/user.entity";

export class AccountProps {
  id: string;
  name: string;
  color: string;
  initialBalance: number;
  createdBy: User;
  createdAt: Date;
  active: boolean;
}

export class Account {
  readonly id: string;
  readonly createdAt: Date;
  name: string;
  color: string;
  initialBalance: number;
  createdBy: User;
  active: boolean;

  constructor(props: AccountProps) {
    this.id = props.id;
    this.name = props.name;
    this.color = props.color;
    this.createdAt = props.createdAt;
    this.initialBalance = props.initialBalance;
    this.createdBy = props.createdBy;
    this.active = props.active;
  }

  getId(): string {
    return this.id;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getName(): string {
    return this.name;
  }

  getColor(): string {
    return this.color;
  }

  getInitialBalance(): number {
    return this.initialBalance;
  }

  getCreatedById(): string {
    return this.createdBy.getId();
  }

  isActive(): boolean {
    return this.active;
  }

  setName(name: string) {
    this.name = name;
  }

  setColor(color: string) {
    this.color = color;
  }

  setInitialBalance(initialBalance: number) {
    this.initialBalance = initialBalance;
  }

  delete(): void {
    this.active = false;
  }

  restore(): void {
    this.active = true;
  }
}
