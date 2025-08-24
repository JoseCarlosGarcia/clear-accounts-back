import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/infrastructure/postgres/entity/user.entity';
import { UserModule } from 'src/user/user.module';
import { EnvModule } from './modules/env/env.module';
import { EnvService } from './modules/env/services/env';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    EnvModule,
    TypeOrmModule.forRootAsync({
      useFactory(envServices: EnvService) {
        return {
          type: 'postgres',
          host: envServices.DATABASE_HOST,
          port: envServices.DATABASE_PORT,
          password: envServices.DATABASE_PASSWORD,
          username: envServices.DATABASE_USERNAME,
          database: envServices.DATABASE_NAME,
          synchronize: true,
          logging: false,
          dropSchema: false,
          entities: [UserEntity],
        };
      },
      inject: [EnvService],
      imports: [EnvModule],
    }),
    UserModule,
  ],
  controllers: [],
  providers: [JwtService],
})
export class AppModule {}
