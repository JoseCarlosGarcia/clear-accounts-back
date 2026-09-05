import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInRequest {
  @ApiProperty({
    description: 'Correo electrónico de la cuenta',
    example: 'briancito@example.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña',
    example: 'unaContraseñaSegura',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
