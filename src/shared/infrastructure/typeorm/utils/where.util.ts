import {
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
  Raw,
  FindOperator,
  In,
} from 'typeorm';

let rawParamCounter = 0;

export class WhereUtils {
  /**
   * Builds an inclusive range condition (>= min, <= max) for comparable values.
   */
  static range<T>(min?: T, max?: T): FindOperator<T> | undefined {
    if (min != null && max != null) return Between(min, max);
    if (min != null) return MoreThanOrEqual(min);
    if (max != null) return LessThanOrEqual(max);
    return undefined;
  }

  /**
   * Builds an inclusive date range condition, adjusting times to 00:00 and 23:59:59.999.
   */
  static dateRange(
    minDate?: Date,
    maxDate?: Date,
  ): FindOperator<Date> | undefined {
    if (minDate && !isNaN(minDate.getTime())) minDate.setHours(0, 0, 0, 0);
    if (maxDate && !isNaN(maxDate.getTime())) maxDate.setHours(23, 59, 59, 999);

    return this.range(minDate, maxDate);
  }

  /**
   * Returns a Raw condition for ILIKE ignoring accents, spaces, and case.
   * Requiere la extensión `unaccent` de Postgres.
   */
  static ilikeUnaccent(value?: string): FindOperator<string> | undefined {
    if (!value) return undefined;

    const normalized = value.toLowerCase().replace(/[^a-z0-9]/gi, '');
    const key = `param_${rawParamCounter++}`;

    return Raw(
      (alias) =>
        `REGEXP_REPLACE(LOWER(unaccent(${alias})), '[^a-z0-9]', '', 'g') ILIKE :${key}`,
      { [key]: `%${normalized}%` },
    );
  }

  /**
   * Returns the value if defined, otherwise undefined.
   */
  static assignIfExists<T>(value?: T): T | undefined {
    return value !== undefined ? value : undefined;
  }

  /**
   * Creates an OR condition for multiple values.
   * If single value, returns equality condition.
   * If multiple values, returns IN condition.
   */
  static orCondition<T>(values?: T | T[]): FindOperator<T> | T | undefined {
    if (values === undefined || values === null) return undefined;

    if (Array.isArray(values)) {
      return !values.length
        ? undefined
        : values.length > 1
          ? In(values)
          : values[0];
    }

    return values;
  }
}
