import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccountGetByIdRequest {
  @ApiProperty({
    description: 'Identificador único de la cuenta que se desea obtener',
    example: '01J9Z9A9K7ZQW1T8S9H3B5V4FY',
  })
  @IsString()
  id: string;
}
