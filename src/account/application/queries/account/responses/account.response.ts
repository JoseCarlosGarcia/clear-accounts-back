import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "src/user/application/queries/responses/user.response";

export class AccountResponse {
  @ApiProperty({
    description: 'Identificador único de la cuenta',
    example: '01J9Z9A9K7ZQW1T8S9H3B5V4FY',
  })
  id: string;

  @ApiProperty({
    description: 'Fecha de creación de la cuenta',
    example: '2026-09-04T10:30:00.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Nombre',
    example: 'Cuenta conjunta',
  })
  name: string;

  @ApiProperty({
    description: 'Color en hexadecimal',
    example: '#fff',
  })
  color: string;

  @ApiProperty({
    description: 'Balance inicial',
    example: 5000,
  })
  initialBalance: number;

  @ApiProperty({
    description: 'Información del creador de la cuenta',
    type: UserResponse
  })
  createdBy: UserResponse;

  @ApiProperty({
    description: 'Indica si la cuenta está eliminada',
    example: false,
    default: false,
  })
  active: boolean;
}

