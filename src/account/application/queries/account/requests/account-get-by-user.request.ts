import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { AccountMembershipSort } from 'src/account/domain/enums/account-membership-sort';
import { IsBooleanOptional } from 'src/shared/application/decorators/is-boolean.decorator';
import { TransformSort } from 'src/shared/application/decorators/transform-sort.decorator';
import { PaginationRequest } from 'src/shared/application/requests/pagination.request';
import { SortOptionRequest } from 'src/shared/application/requests/sort-options.request';

export class AccountGetByUserRequest extends PaginationRequest {
  @ApiPropertyOptional({
    description: 'Filtra por nombre de la cuenta',
    example: 'Cuenta conjunta',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description:
      'Cuentas activas (true) o borradas (false). Por defecto, activas',
    example: true,
  })
  @IsBooleanOptional()
  active?: boolean;

  @ApiPropertyOptional({
    description:
      'Orden, por ejemplo [{"field":"account-name","direction":"ASC"}]',
    isArray: true,
  })
  @TransformSort(AccountMembershipSort)
  sort?: SortOptionRequest<AccountMembershipSort>[];
}
