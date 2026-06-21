import { PaginationInfo, PaginationParams } from "src/shared/domain/interfaces/pagination";

export interface PaginationOptions {
  skip?: number;
  take?: number;
}

/**
 * Calculates pagination information based on the request parameters
 * and the total number of items.
 *
 * If no `page` or `pageSize` is provided, it returns a single page
 * containing all items (no pagination applied).
 */
export function getPaginationInfo(
  totalItems: number,
  request: PaginationParams,
): PaginationInfo {
  // No pagination parameters → return all items in one page
  if (!request.page || !request.pageSize) {
    return {
      page: 1,
      pageSize: totalItems,
      totalPages: 1,
      hasNextPage: false,
    };
  }

  const { page, pageSize } = request;
  const totalPages = Math.ceil(totalItems / pageSize);
  const hasNextPage = page < totalPages;

  return { page, pageSize, totalPages, hasNextPage };
}

/**
 * Returns the `skip` and `take` options for TypeORM queries.
 *
 * If no `page` or `pageSize` is provided, it returns an empty object,
 * meaning no pagination (fetch all items).
 */
export function getPaginationOptions(
  request: PaginationParams,
): PaginationOptions {
  if (!request.page || !request.pageSize) {
    // No pagination applied → fetch all
    return {};
  }

  const skip = (request.page - 1) * request.pageSize;
  const take = request.pageSize;

  return { skip, take };
}
