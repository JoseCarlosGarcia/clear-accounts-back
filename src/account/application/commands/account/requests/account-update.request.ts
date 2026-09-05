import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsNotEmpty, Matches } from 'class-validator';

export class AccountUpdateRequest {
  @ApiPropertyOptional({
    description: 'Nombre de la cuenta',
    example: 'Cuenta conjunta',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    description: 'Color en hexadecimal',
    example: '#5a8eff',
  })
  @IsOptional()
  @IsString()
  @Matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
    message: 'color debe ser un hexadecimal como #fff o #5a8eff',
  })
  color?: string;

  @ApiPropertyOptional({
    description:
      'Corrige el saldo inicial. Afecta al balance que ven todos los miembros',
    example: 5000,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  initialBalance?: number;
}
