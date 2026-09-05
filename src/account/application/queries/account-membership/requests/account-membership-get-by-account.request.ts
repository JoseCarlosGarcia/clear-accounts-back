import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AccountMembershipSort } from 'src/account/domain/enums/account-membership-sort';
import { AccountRole } from 'src/account/domain/enums/account-role';
import { IsBooleanOptional } from 'src/shared/application/decorators/is-boolean.decorator';
import { ToStringArray } from 'src/shared/application/decorators/to-string-array.decorator';
import { TransformSort } from 'src/shared/application/decorators/transform-sort.decorator';
import { PaginationRequest } from 'src/shared/application/requests/pagination.request';
import { SortOptionRequest } from 'src/shared/application/requests/sort-options.request';

export class AccountMembershipGetByAccountRequest extends PaginationRequest {
  @ApiPropertyOptional({
    description: 'Filtra por rol',
    enum: AccountRole,
    isArray: true,
  })
  @ToStringArray()
  @IsEnum(AccountRole, { each: true })
  role?: AccountRole[];

  @ApiPropertyOptional({
    description:
      'Miembros actuales (true) o que ya salieron (false). Por defecto, actuales',
    example: true,
  })
  @IsBooleanOptional()
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Orden, por ejemplo [{"field":"user-name","direction":"ASC"}]',
    isArray: true,
  })
  @TransformSort(AccountMembershipSort)
  sort?: SortOptionRequest<AccountMembershipSort>[];
}
