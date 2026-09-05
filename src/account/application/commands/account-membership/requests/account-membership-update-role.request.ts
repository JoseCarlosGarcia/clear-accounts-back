import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AccountRole } from 'src/account/domain/enums/account-role';

export class AccountMembershipUpdateRoleRequest {
  @ApiProperty({
    description: 'Nuevo rol del miembro',
    enum: AccountRole,
    example: AccountRole.OWNER,
  })
  @IsEnum(AccountRole)
  role: AccountRole;
}
