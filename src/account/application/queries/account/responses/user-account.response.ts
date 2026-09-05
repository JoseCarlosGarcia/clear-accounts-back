import { ApiProperty } from '@nestjs/swagger';
import { AccountRole } from 'src/account/domain/enums/account-role';
import { AccountResponse } from './account.response';

export class UserAccountResponse extends AccountResponse {
  @ApiProperty({
    description: 'Rol del usuario autenticado en la cuenta',
    enum: AccountRole,
    example: AccountRole.OWNER,
  })
  role: AccountRole;
}
