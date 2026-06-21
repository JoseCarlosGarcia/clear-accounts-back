import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponse<T> {
  @ApiProperty({ isArray: true, description: 'Elementos en la página actual' })
  items: T[];

  @ApiProperty({ description: 'Número total de elementos disponibles' })
  totalItems: number;

  @ApiProperty({ description: 'Número total de páginas disponibles' })
  totalPages: number;

  @ApiProperty({ description: 'Cantidad de elementos por página' })
  pageSize: number;

  @ApiProperty({ description: 'Indica si hay una página siguiente' })
  hasNextPage: boolean;
}
