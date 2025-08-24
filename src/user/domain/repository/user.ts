import { User } from '../entities/user';

export interface IUserRepository {
  all(props: GetUserProps): Promise<User[]>;
  delete(id: number): Promise<void>;
  create(props: CreateUserProps): Promise<number>;
  update(props: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
}

export interface GetUserProps {
  deleted?: boolean;
}

export interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}
