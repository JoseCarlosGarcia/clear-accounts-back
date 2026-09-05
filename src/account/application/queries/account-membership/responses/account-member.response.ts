import { ApiProperty } from '@nestjs/swagger';
import { AccountRole } from 'src/account/domain/enums/account-role';
import { UserResponse } from 'src/user/application/queries/responses/user.response';

export class AccountMemberResponse {
  @ApiProperty({
    description: 'Identificador único de la membresía',
    example: '01J9Z9A9K7ZQW1T8S9H3B5V4FY',
  })
  id: string;

  @ApiProperty({
    description: 'Fecha en la que se unió a la cuenta',
    example: '2026-09-04T10:30:00.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Información del usuario',
    type: UserResponse,
  })
  user: UserResponse;

  @ApiProperty({
    description: 'Rol en la cuenta',
    enum: AccountRole,
    example: AccountRole.OWNER,
  })
  role: AccountRole;

  @ApiProperty({
    description: 'Indica si sigue perteneciendo a la cuenta',
    example: true,
    default: true,
  })
  active: boolean;
}
