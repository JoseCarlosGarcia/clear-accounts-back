import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { EnvModule } from './modules/env/env.module';
import { SharedModule } from 'src/shared/shared.module';
import { DatabaseModule } from 'src/database/database.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    SharedModule,
    UserModule,
    AuthenticationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
