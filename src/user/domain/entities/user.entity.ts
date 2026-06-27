interface Props {
  id: string;
  email: string;
  password: string;
  name: string;
  active: boolean;
  createdAt?: Date;
}

export class User {
  readonly id: string;
  readonly createdAt: Date;
  email: string;
  password: string;
  name: string;
  active: boolean;

  constructor({ email, createdAt, id, password, name, active }: Props) {
    this.id = id;
    this.createdAt = createdAt ?? new Date();
    this.email = email;
    this.password = password;
    this.active = active;
    this.name = name;
  }

  getId(): string {
    return this.id;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  getName(): string {
    return this.name;
  }

  isActive(): boolean {
    return this.active;
  }

  setName(name: string) {
    this.name = name;
  }

  setEmail(email: string) {
    this.email = email;
  }

  setPassword(password: string) {
    this.password = password;
  }

  delete() {
    this.active = false;
  }
}
