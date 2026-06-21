export interface PaginationResult<T> {
  items: T[];
  totalItems: number;
  pagination: PaginationInfo;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
}
