import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export function IsBooleanOptional() {
  return applyDecorators(
    Transform(({ value }) => {
      if (value === undefined) return undefined;
      if (value === 'true' || value === true) return true;
      if (value === 'false' || value === false) return false;
      return undefined;
    }),
    IsOptional(),
    IsBoolean(),
  );
}
