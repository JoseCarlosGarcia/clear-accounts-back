import { applyDecorators, BadRequestException } from '@nestjs/common';
import { ValidateNested, IsOptional } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import {
  SortDirection,
  SortOptionRequest,
} from '../requests/sort-options.request';

/**
 * Decorator that transforms and validates sort options for DTOs.
 *
 * This decorator handles the transformation of sort parameters from string format
 * to structured SortOptionRequest objects, validating against an allowed set of fields
 * defined by an enum.
 *
 * @template TFields - The string literal type representing allowed sort fields
 * @param enumType - Enum containing the allowed sort field values
 * @returns A composed decorator that applies validation and transformation
 *
 * @example
 * ```typescript
 * class CarPaginationRequest {
 *   @TransformSort(CarSortFields)
 *   sort?: SortOptionRequest<CarSortFields>[];
 * }
 * ```
 */
export function TransformSort<TFields extends string>(enumType: any) {
  return applyDecorators(
    IsOptional(),
    ValidateNested({ each: true }),
    Type(() => SortOptionRequest),
    Transform(({ value }) => transformSortWithEnum<TFields>(value, enumType)),
  );
}

/**
 * Transforms and validates raw sort input against an enum of allowed fields.
 *
 * This function handles:
 * - JSON parsing if input is a string
 * - Validation of field names against allowed enum values
 * - Validation of sort direction (ASC/DESC)
 * - Graceful handling of malformed individual items
 *
 * @template TFields - The string literal type representing allowed sort fields
 * @param value - Raw input value (string or array)
 * @param enumType - Enum containing allowed sort field values
 * @returns Array of validated SortOptionRequest objects or undefined if no valid items
 * @throws {BadRequestException} When JSON parsing fails for the entire input
 *
 * @example
 * ```typescript
 * // Input: '[{"field": "name", "direction": "ASC"}]'
 * // Output: [SortOptionRequest { field: 'name', direction: 'ASC' }]
 * ```
 */
function transformSortWithEnum<TFields extends string>(
  value: any,
  enumType: any,
): SortOptionRequest<TFields>[] | undefined {
  if (!value) return undefined;

  try {
    const parsedValue: unknown =
      typeof value === 'string' ? JSON.parse(value) : value;

    if (!Array.isArray(parsedValue)) return undefined;

    // Extract allowed field values from the enum
    const allowedFields: TFields[] = Object.values(
      enumType as { [s: string]: TFields } | ArrayLike<TFields>,
    );

    // Validate each item individually, skipping invalid ones
    const validItems: SortOptionRequest<TFields>[] = [];

    for (const item of parsedValue) {
      try {
        // Basic structure validation
        if (
          !item ||
          typeof item !== 'object' ||
          !('field' in item) ||
          !('direction' in item)
        ) {
          continue;
        }

        // Safe type assertion for field and direction
        const potentialItem = item as { field?: unknown; direction?: unknown };
        const field =
          typeof potentialItem.field === 'string'
            ? potentialItem.field
            : undefined;
        const direction =
          typeof potentialItem.direction === 'string'
            ? potentialItem.direction
            : undefined;

        // Validate field is string and in allowed fields
        if (
          typeof potentialItem.field !== 'string' ||
          !allowedFields.includes(potentialItem.field as TFields)
        ) {
          continue;
        }

        // Validate direction is ASC or DESC
        if (
          typeof direction !== 'string' ||
          !(
            direction === SortDirection.ASC.toString() ||
            direction === SortDirection.DESC.toString()
          )
        ) {
          continue;
        }

        // Create validated sort option
        const sortOption = new SortOptionRequest<TFields>();
        sortOption.field = field as TFields;
        sortOption.direction = direction as SortDirection;
        validItems.push(sortOption);
      } catch {
        // Skip individual items that cause errors
        continue;
      }
    }

    return validItems.length > 0 ? validItems : undefined;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new BadRequestException(
      `Invalid JSON format for sort parameter: ${message}`,
    );
  }
}
