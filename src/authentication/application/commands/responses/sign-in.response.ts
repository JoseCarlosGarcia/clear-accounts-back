import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from 'src/user/application/queries/responses/user.response';

export class SignInResponse {
  @ApiProperty({
    description: 'Usuario autenticado',
    type: UserResponse,
  })
  user: UserResponse;

  @ApiProperty({
    description:
      'Token JWT de acceso. Se envía en la cabecera Authorization como "Bearer <token>"',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;
}
