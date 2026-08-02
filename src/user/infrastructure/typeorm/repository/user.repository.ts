import { Injectable } from '@nestjs/common';
import { UserModel } from '../models/user.model';
import { DataSource } from 'typeorm';
import { User } from 'src/user/domain/entities/user.entity';
import { BaseTypeOrmRepository } from 'src/shared/infrastructure/typeorm/base-typeorm.repository';
import { TransactionExecutor } from 'src/shared/infrastructure/typeorm/typeorm-transaction.executor';
import { UserMapper } from '../mappers/user-mapper';
import { IUserRepository } from 'src/user/domain/repositories/user.repository';

@Injectable()
export class TypeOrmUserRepository
  extends BaseTypeOrmRepository<UserModel>
  implements IUserRepository
{
  constructor(
    dataSource: DataSource,
    transactionExecutor: TransactionExecutor,
  ) {
    super(dataSource, transactionExecutor, UserModel);
  }

  async save(user: User): Promise<void> {
    const model = UserMapper.toModel(user);
    await this.repository.save(model);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id: id });
  }

  async update(user: User): Promise<void> {
    await this.repository.update(
      { id: user.getId() },
      {
        email: user.email,
        name: user.name,
        active: user.active,
      },
    );
  }

  async updatePassword(user: User): Promise<void> {
    await this.repository.update(
      { id: user.getId() },
      {
        password: user.password,
      },
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await this.repository.findOne({
      where: { email: email },
    });

    return found ? UserMapper.toDomain(found) : null;
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    const found = await this.repository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: email })
      .getOne();

    return found ? UserMapper.toDomain(found) : null;
  }

  async findById(id: string): Promise<User | null> {
    const found = await this.repository.findOne({
      where: { id: id },
    });

    return found ? UserMapper.toDomain(found) : null;
  }
}

