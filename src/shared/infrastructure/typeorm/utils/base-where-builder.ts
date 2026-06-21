import { FindOptionsWhere } from 'typeorm';

/**
 * Base class for building TypeORM `where` conditions from filter parameters.
 * Public entry point: `build()`. The logic is implemented in
 * `buildWhereConditions` (may mutate `where` -> void, or return an object/array for OR).
 *
 * @template TModel - The TypeORM entity type
 * @template TFilters - The filter parameters interface
 */
export abstract class BaseWhereBuilder<TModel, TFilters> {
  protected abstract buildWhereConditions(
    where: FindOptionsWhere<TModel>,
    filters: TFilters,
  ): FindOptionsWhere<TModel> | FindOptionsWhere<TModel>[] | void;

  private execute(
    filters: TFilters,
  ): FindOptionsWhere<TModel> | FindOptionsWhere<TModel>[] {
    const where: FindOptionsWhere<TModel> = {};
    const result = this.buildWhereConditions(where, filters);

    return result !== undefined ? result : where;
  }

  static build<TModel, TFilters>(
    this: new () => BaseWhereBuilder<TModel, TFilters>,
    filters: TFilters,
  ): FindOptionsWhere<TModel> | FindOptionsWhere<TModel>[] {
    return new this().execute(filters);
  }
}
