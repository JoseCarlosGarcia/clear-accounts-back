import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EnvService } from 'src/env/services/env';
import { createDataSource } from './typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        ...createDataSource({
          host: env.DATABASE_HOST,
          port: env.DATABASE_PORT,
          username: env.DATABASE_USERNAME,
          password: env.DATABASE_PASSWORD,
          database: env.DATABASE_NAME,
        }).options,
        // Las migraciones NO se corren desde el DataSource; las aplica
        // onModuleInit segun MIGRATION_RUN (control explicito + logging).
        migrationsRun: false,
        synchronize: env.SYNCHRONIZE,
        dropSchema: env.DROP_SCHEMA,
      }),
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly env: EnvService,
  ) {}

  async onModuleInit() {
    if (!this.env.MIGRATION_RUN) {
      return;
    }

    const migrations = await this.dataSource.runMigrations();
    if (migrations.length > 0) {
      this.logger.log(
        `Ejecutadas ${migrations.length} migracion(es): ${migrations
          .map((m) => m.name)
          .join(', ')}`,
      );
    } else {
      this.logger.log('No hay migraciones pendientes');
    }
  }
}
