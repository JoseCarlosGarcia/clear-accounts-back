import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private readonly config: ConfigService) {}

  readonly DATABASE_NAME = this.config.getOrThrow<string>('DB_NAME');
  readonly DATABASE_USERNAME = this.config.getOrThrow<string>('DB_USERNAME');
  readonly DATABASE_PASSWORD = this.config.getOrThrow<string>('DB_PASSWORD');
  readonly DATABASE_PORT = Number(this.config.getOrThrow<string>('DB_PORT'));
  readonly DATABASE_HOST = this.config.getOrThrow<string>('DB_HOST');
  readonly SYNCHRONIZE =
    this.config.getOrThrow<string>('SYNCHRONIZE') === 'true';
  readonly MIGRATION_RUN =
    this.config.getOrThrow<string>('MIGRATION_RUN') === 'true';
  readonly DROP_SCHEMA =
    this.config.getOrThrow<string>('DROP_SCHEMA') === 'true';
  readonly ACCESS_TOKEN_SECRET_WORD =
    this.config.getOrThrow<string>('JWT_SECRET');
  readonly TOKEN_EXPIRES_TIME =
    this.config.getOrThrow<string>('TOKEN_EXPIRES_TIME');
}
