import { Global, Module } from '@nestjs/common';
import { EnvService } from './services/env';
import { ConfigModule } from '@nestjs/config';

const filterEnv = () => {
  const NODE_ENV = process.env.NODE_ENV;

  if (NODE_ENV === 'production') {
    return '.env';
  } else {
    return '.env.local';
  }
};

const envFile = filterEnv();

@Global()
@Module({
  controllers: [],
  exports: [EnvService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFile,
      expandVariables: true,
      isGlobal: false,
    }),
  ],
  providers: [EnvService],
})
export class EnvModule {}
