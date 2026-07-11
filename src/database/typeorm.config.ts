import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AppNamingStrategy } from './naming.strategy';
import { resolveEnvFilePath } from '../env/env-file';

// Carga .env.local en desarrollo, .env en produccion (igual que EnvModule).
config({ path: resolveEnvFilePath() });

export interface DatabaseConnection {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

/**
 * Construye el DataSource. Lo usan dos consumidores:
 *   1. La CLI de TypeORM (este archivo, via el export default).
 *   2. El runtime de Nest (DatabaseModule), pasando la conexion desde EnvService.
 *
 * Los globs usan __dirname para resolver a `.ts` en desarrollo (ts-node) y a
 * `.js` en produccion (dist) sin cambios.
 */
export function createDataSource(conn: DatabaseConnection): DataSource {
  const options: DataSourceOptions = {
    type: 'postgres',
    host: conn.host,
    port: conn.port,
    username: conn.username,
    password: conn.password,
    database: conn.database,
    namingStrategy: new AppNamingStrategy(),
    entities: [__dirname + '/../**/*.model{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    // La CLI nunca aplica migraciones al cargar el DataSource; se corren
    // explicitamente con `migration:run` o desde DatabaseModule al arrancar.
    migrationsRun: false,
    synchronize: false,
    ssl: process.env.NODE_ENV === 'production',
    logging: false,
  };

  return new DataSource(options);
}

const AppDataSource = createDataSource({
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
});

export default AppDataSource;
