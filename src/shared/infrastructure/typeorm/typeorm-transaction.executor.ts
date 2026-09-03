import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class TransactionExecutor {
  private static readonly entityManagerStorage =
    new AsyncLocalStorage<EntityManager>();

  constructor(private readonly dataSource: DataSource) {}

  async execute<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      return await TransactionExecutor.entityManagerStorage.run(
        queryRunner.manager,
        async () => {
          const result = await work(queryRunner.manager);
          await queryRunner.commitTransaction();
          return result;
        },
      );
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  getManagerIfActive(): EntityManager | null {
    return TransactionExecutor.entityManagerStorage.getStore() || null;
  }
}
