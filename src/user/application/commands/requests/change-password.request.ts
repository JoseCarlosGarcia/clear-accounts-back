import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordRequest {
  @ApiProperty({
    description: 'Contraseña nueva',
    example: 'unaContraseñaSegura',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Contraseña actual, para confirmar el cambio',
    example: 'laContraseñaAnterior',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}
