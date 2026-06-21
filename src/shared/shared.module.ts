import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TransactionExecutor } from './infrastructure/typeorm/typeorm-transaction.executor';
import { UlidGenerator } from './domain/services/ulid.generator';
import { DomainExceptionFilter } from './infrastructure/nest/filters/domain-exception.filter';

@Global()
@Module({
  providers: [
    TransactionExecutor,
    UlidGenerator,
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
  ],
  exports: [TransactionExecutor, UlidGenerator],
})
export class SharedModule {}
