import { Injectable, Scope } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { DataSource, EntityManager } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class TransactionExecutor {
  private static readonly entityManagerStorage =
    new AsyncLocalStorage<EntityManager>();

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Corre `work` dentro de una transacción. Hace commit si termina bien,
   * rollback si lanza, y libera el queryRunner siempre.
   */
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

  /**
   * El EntityManager de la transacción activa, o null si no hay ninguna.
   * Lo usan los repositorios para engancharse a la transacción en curso.
   */
  getManagerIfActive(): EntityManager | null {
    return TransactionExecutor.entityManagerStorage.getStore() || null;
  }
}
