import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

/**
 * Generic sort option
 */
export class SortOptionRequest<TFields extends string> {
  @ApiPropertyOptional({ description: 'Campo por el cual ordenar' })
  @IsString()
  field: TFields;

  @ApiPropertyOptional({
    description: 'Dirección del orden: ASC = ascendente, DESC = descendente',
    enum: SortDirection,
  })
  @IsString()
  @IsEnum(SortDirection)
  direction: SortDirection;
}
