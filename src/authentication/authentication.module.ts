import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/nest/controllers/auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  exports: [],
  providers: [],
})
export class AuthenticationModule {}
