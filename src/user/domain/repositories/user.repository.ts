import { User } from '../entities/user.entity';

export interface IUserRepository {
  delete(id: string): Promise<void>;
  save(props: User): Promise<void>;
  update(props: User): Promise<void>;
  updatePassword(props: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailWithPassword(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}