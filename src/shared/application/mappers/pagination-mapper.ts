import { PaginationResponse } from '../responses/pagination.response';

export class PaginationResponseMapper {
  static toResponse<T>(params: {
    items: T[];
    totalItems: number;
    totalPages: number;
    pageSize: number;
    hasNextPage: boolean;
  }): PaginationResponse<T> {
    const { items, totalItems, totalPages, pageSize, hasNextPage } = params;

    return {
      items,
      totalItems,
      totalPages,
      pageSize,
      hasNextPage,
    };
  }
}
