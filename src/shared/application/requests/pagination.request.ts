import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationRequest {
  @ApiPropertyOptional({ description: 'Número de página, empieza en 1' })
  @ValidateIf((o: PaginationRequest) => o.pageSize !== undefined) // validate page if pageSize is provided
  @IsInt({ message: 'Page must be an integer if pageSize is provided' })
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de elementos por página, empieza en 1',
  })
  @ValidateIf((o: PaginationRequest) => o.page !== undefined) // validate pageSize if page is provided
  @IsInt({ message: 'pageSize must be an integer if page is provided' })
  @Min(1)
  @Type(() => Number)
  pageSize?: number;
}
