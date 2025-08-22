import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private readonly services: ConfigService) {}

  readonly DATABASE_NAME = this.services.getOrThrow<string>('DB_NAME');
  readonly DATABASE_USERNAME = this.services.getOrThrow<string>('DB_USERNAME');
  readonly DATABASE_PASSWORD = this.services.getOrThrow<string>('DB_PASSWORD');
  readonly DATABASE_PORT = Number(this.services.getOrThrow<string>('DB_PORT'));
  readonly DATABASE_HOST = this.services.getOrThrow<string>('DB_HOST');

  readonly ACCCESS_TOKEN_SECRET_WORD =
    this.services.getOrThrow<string>('JWT_SECRET');

  readonly TOKEN_EXPIRES_TIME =
    this.services.getOrThrow<string>('TOKEN_EXPIRES_TIME');
}
