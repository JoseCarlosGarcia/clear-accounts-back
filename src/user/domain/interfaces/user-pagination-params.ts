import { PaginationParams } from "src/shared/domain/interfaces/pagination";

export interface UserPaginationParams extends PaginationParams {
  active?: boolean;
}
