import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateUserProps,
  GetUserProps,
  IUserRepository,
} from 'src/user/domain/repository/user';
import { UserModel } from '../entity/user.model';
import { Repository } from 'typeorm';
import { User } from 'src/user/domain/entities/user';
import { UserPostgresMapper } from '../domain/user-mapper';

@Injectable()
export class UserPostgresRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  async all(props: GetUserProps): Promise<User[]> {
    const users = await this.userRepository.find({
      order: { created_at: 'DESC' },
      where: { deleted: props.deleted },
    });

    return users.map((u) => UserPostgresMapper.execute(u));
  }

  async create(props: CreateUserProps): Promise<number> {
    const user = new UserModel();
    user.email = props.email;
    user.name = props.name;
    user.password = props.password;
    user.created_at = new Date();

    await this.userRepository.save(user);

    return user.id;
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete({ id: id });
  }

  async update(user: User): Promise<void> {
    await this.userRepository.update(
      { id: user.id },
      {
        email: user.email,
        name: user.name,
        password: user.password,
        deleted: user.deleted,
      },
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await this.userRepository.findOne({
      where: { email: email },
    });

    return found ? UserPostgresMapper.execute(found) : null;
  }

  async findById(id: number): Promise<User | null> {
    const found = await this.userRepository.findOneBy({ id: id });

    return found ? UserPostgresMapper.execute(found) : null;
  }
}

