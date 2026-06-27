import {
  DataSource,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { TransactionExecutor } from './typeorm-transaction.executor';

export abstract class BaseTypeOrmRepository<Model extends ObjectLiteral> {
  protected constructor(
    private readonly dataSource: DataSource,
    private readonly transactionExecutor: TransactionExecutor,
    private readonly target: EntityTarget<Model>,
  ) {}

  protected get repository(): Repository<Model> {
    const manager: EntityManager | null =
      this.transactionExecutor.getManagerIfActive();

    return manager
      ? manager.getRepository(this.target)
      : this.dataSource.getRepository(this.target);
  }
}
