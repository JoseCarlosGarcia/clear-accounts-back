import { SortOption } from 'src/shared/domain/interfaces/sort-option';
import { FindOptionsOrder } from 'typeorm';

/**
 * Base class for building TypeORM `order` options from sort specifications.
 * Public entry point: `build()`. Each entity implements `buildOrder`
 * (field mapping) and `getDefaultOrder` (default ordering).
 *
 * @template TModel - The TypeORM entity type
 * @template TFields - Union type of allowed sort field names
 */
export abstract class BaseOrderBuilder<TModel, TFields extends string> {
  protected order: FindOptionsOrder<TModel> = {};

  protected abstract buildOrder(sortOptions?: SortOption<TFields>[]): void;
  protected abstract getDefaultOrder(): FindOptionsOrder<TModel>;

  private execute(
    sortOptions?: SortOption<TFields>[],
  ): FindOptionsOrder<TModel> {
    this.order = {};
    this.buildOrder(sortOptions);
    return Object.keys(this.order).length ? this.order : this.getDefaultOrder();
  }

  static build<TModel, TFields extends string>(
    this: new () => BaseOrderBuilder<TModel, TFields>,
    sortOptions?: SortOption<TFields>[],
  ): FindOptionsOrder<TModel> {
    return new this().execute(sortOptions);
  }
}
