import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { EnvModule } from './modules/env/env.module';
import { JwtService } from '@nestjs/jwt';
import { SharedModule } from 'src/shared/shared.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [EnvModule, DatabaseModule, SharedModule, UserModule],
  controllers: [],
  providers: [JwtService],
})
export class AppModule {}
