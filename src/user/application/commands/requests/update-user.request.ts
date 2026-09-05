import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRequest {
  @ApiProperty({
    description: 'Nombre',
    example: 'Briancito',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Correo electrónico, único entre usuarios activos',
    example: 'briancito@example.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
