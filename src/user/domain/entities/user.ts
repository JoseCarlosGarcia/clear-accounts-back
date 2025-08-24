interface Props {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: Date;
  deleted: boolean;
}

export class User {
  readonly id: number;
  readonly created_at: Date;
  email: string;
  password: string;
  name: string;
  deleted: boolean;

  constructor({
    email,
    created_at,
    id,
    password,
    name,
    deleted,
  }: Props) {
    this.id = id;
    this.created_at = created_at;
    this.email = email;
    this.password = password;
    this.deleted = deleted;
    this.name = name;
  }
}
