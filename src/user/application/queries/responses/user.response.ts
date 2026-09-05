import { ApiProperty } from "@nestjs/swagger";

export class UserResponse {
  @ApiProperty({
      description: 'Identificador único del usuario',
      example: '01J9Z9A9K7ZQW1T8S9H3B5V4FY',
    })
  id: string;

  @ApiProperty({
    description: 'Nombre',
    example: 'Briancito',
  })
  name: string;

  @ApiProperty({
    description: 'Correo electrónico',
    example: 'briancito@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2026-09-04T10:30:00.000Z',
    type: Date,
  })
  createdAt: Date;
}
