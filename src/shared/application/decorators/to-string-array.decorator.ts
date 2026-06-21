import { Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { IsOptional, IsArray, IsString } from 'class-validator';

export function ToStringArray(): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    IsArray({ message: 'Debe ser un array o string separado por comas' }),
    IsString({ each: true, message: 'Cada elemento debe ser un string' }),
    Transform(({ value }: { value: unknown }) => {
      if (value == null) return undefined;

      if (Array.isArray(value)) {
        return value.filter((item) => typeof item === 'string');
      }

      if (typeof value === 'string') {
        return value
          .split(',')
          .map((v) => v.trim())
          .filter((v) => v.length > 0);
      }

      return undefined;
    }),
  );
}
