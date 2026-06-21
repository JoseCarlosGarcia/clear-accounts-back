export type SortDirection = 'ASC' | 'DESC';

export interface SortOption<TFields extends string> {
  field: TFields;
  direction: SortDirection;
}
