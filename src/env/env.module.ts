import { Global, Module } from '@nestjs/common';
import { EnvService } from './services/env';
import { ConfigModule } from '@nestjs/config';
import { resolveEnvFilePath } from './env-file';

@Global()
@Module({
  controllers: [],
  exports: [EnvService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolveEnvFilePath(),
      expandVariables: true,
      isGlobal: false,
    }),
  ],
  providers: [EnvService],
})
export class EnvModule {}
