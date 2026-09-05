import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsNotEmpty, Matches } from 'class-validator';

export class AccountCreateRequest {
  @ApiProperty({
    description: 'Nombre de la cuenta',
    example: 'Cuenta conjunta',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Saldo con el que arranca la cuenta',
    example: 5000,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  initialBalance: number;

  @ApiPropertyOptional({
    description: 'Color en hexadecimal. Por defecto, #5a8eff',
    example: '#5a8eff',
  })
  @IsOptional()
  @IsString()
  @Matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
    message: 'color debe ser un hexadecimal como #fff o #5a8eff',
  })
  color?: string;
}
