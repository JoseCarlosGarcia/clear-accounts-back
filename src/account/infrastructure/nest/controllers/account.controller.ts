import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/authentication/infrastructure/nest/decorators/auth.decorator';
import { CurrentUser } from 'src/shared/infrastructure/nest/decorators/current-user.decorator';
import { ApiPaginatedResponse } from 'src/shared/application/decorators/api-paginated-response.decorator';
import { PaginationResponse } from 'src/shared/application/responses/pagination.response';
import { TransactionExecutor } from 'src/shared/infrastructure/typeorm/typeorm-transaction.executor';
import { UlidGenerator } from 'src/shared/domain/services/ulid.generator';
import { User } from 'src/user/domain/entities/user.entity';
import { UserFindById } from 'src/user/domain/services/user-find-by-id';
import { TypeOrmUserRepository } from 'src/user/infrastructure/typeorm/repository/user.repository';
import { AccountCreate } from 'src/account/domain/services/account/account-create';
import { AccountDelete } from 'src/account/domain/services/account/account-delete';
import { AccountFindById } from 'src/account/domain/services/account/account-find-by-id';
import { AccountRestore } from 'src/account/domain/services/account/account-restore';
import { AccountUpdate } from 'src/account/domain/services/account/account-update';
import { AccountMembershipCreate } from 'src/account/domain/services/account-membership/account-membership-create';
import { AccountMembershipDelete } from 'src/account/domain/services/account-membership/account-membership-delete';
import { AccountMembershipEnsureNotLastMember } from 'src/account/domain/services/account-membership/account-membership-ensure-not-last-member';
import { AccountMembershipFindByAccountAndUser } from 'src/account/domain/services/account-membership/account-membership-find-by-account-and-user';
import { AccountMembershipFindById } from 'src/account/domain/services/account-membership/account-membership-find-by-id';
import { AccountMembershipUpdateOwners } from 'src/account/domain/services/account-membership/account-membership-update-owners';
import { AccountMembershipUpdateRole } from 'src/account/domain/services/account-membership/account-membership-update-role';
import { EnsureAccountMember } from 'src/authorization/domain/services/account-access/ensure-account-member';
import { EnsureAccountRole } from 'src/authorization/domain/services/account-access/ensure-account-role';
import { AccountGetById } from 'src/account/application/queries/account/account-get-by-id.query';
import { AccountGetByUser } from 'src/account/application/queries/account/account-get-by-user.query';
import { AccountGetByUserRequest } from 'src/account/application/queries/account/requests/account-get-by-user.request';
import { AccountResponse } from 'src/account/application/queries/account/responses/account.response';
import { UserAccountResponse } from 'src/account/application/queries/account/responses/user-account.response';
import { AccountMembershipGetByAccount } from 'src/account/application/queries/account-membership/account-membership-get-by-account.query';
import { AccountMembershipGetByAccountAndUser } from 'src/account/application/queries/account-membership/account-membership-get-by-account-and-user.query';
import { AccountMembershipGetByAccountRequest } from 'src/account/application/queries/account-membership/requests/account-membership-get-by-account.request';
import { AccountMemberResponse } from 'src/account/application/queries/account-membership/responses/account-member.response';
import { AccountCreateCommand } from 'src/account/application/commands/account/account-create.command';
import { AccountDeleteCommand } from 'src/account/application/commands/account/account-delete.command';
import { AccountRestoreCommand } from 'src/account/application/commands/account/account-restore.command';
import { AccountUpdateCommand } from 'src/account/application/commands/account/account-update.command';
import { AccountCreateRequest } from 'src/account/application/commands/account/requests/account-create.request';
import { AccountUpdateRequest } from 'src/account/application/commands/account/requests/account-update.request';
import { AccountMembershipLeaveCommand } from 'src/account/application/commands/account-membership/account-membership-leave.command';
import { AccountMembershipRemoveCommand } from 'src/account/application/commands/account-membership/account-membership-remove.command';
import { AccountMembershipUpdateRoleCommand } from 'src/account/application/commands/account-membership/account-membership-update-role.command';
import { AccountMembershipUpdateRoleRequest } from 'src/account/application/commands/account-membership/requests/account-membership-update-role.request';
import { TypeOrmAccountRepository } from '../../typeorm/repositories/account.repository';
import { TypeOrmAccountMembershipRepository } from '../../typeorm/repositories/account-membership.repository';

@Auth()
@ApiTags('Accounts')
@Controller('accounts')
export class AccountController {
  constructor(
    @Inject()
    private readonly transactionExecutor: TransactionExecutor,
    @Inject()
    private readonly idGenerator: UlidGenerator,
    @Inject()
    private readonly accountRepository: TypeOrmAccountRepository,
    @Inject()
    private readonly accountMembershipRepository: TypeOrmAccountMembershipRepository,
    @Inject()
    private readonly userRepository: TypeOrmUserRepository,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una cuenta',
    description: 'Quien la crea queda registrado como su primer owner.',
  })
  @ApiCreatedResponse({ type: AccountResponse })
  async create(
    @Body() request: AccountCreateRequest,
    @CurrentUser() user: User,
  ): Promise<AccountResponse> {
    return this.transactionExecutor.execute(async () => {
      const command = new AccountCreateCommand(
        new AccountCreate(this.accountRepository, this.idGenerator),
        new AccountMembershipCreate(
          this.accountMembershipRepository,
          this.buildAccountFindById(),
          new UserFindById(this.userRepository),
          this.buildFindByAccountAndUser(),
          this.idGenerator,
        ),
      );

      return command.execute({ request, user });
    });
  }

  @Get()
  @ApiOperation({
    summary:
      'Listar las cuentas del usuario autenticado, con su rol en cada una',
  })
  @ApiPaginatedResponse(UserAccountResponse)
  async findByUser(
    @Query() request: AccountGetByUserRequest,
    @CurrentUser() user: User,
  ): Promise<PaginationResponse<UserAccountResponse>> {
    const query = new AccountGetByUser(this.accountMembershipRepository);

    return query.execute({ request, user });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de una cuenta' })
  @ApiOkResponse({ type: AccountResponse })
  @ApiForbiddenResponse({
    description: 'not-account-member: no perteneces a la cuenta',
  })
  @ApiNotFoundResponse({
    description: 'account-not-found: no existe o está borrada',
  })
  async findById(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<AccountResponse> {
    const query = new AccountGetById(
      this.buildAccountFindById(),
      this.buildEnsureAccountMember(),
    );

    return query.execute({ request: { id }, user });
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Editar el nombre, el color o el saldo inicial de una cuenta',
  })
  @ApiOkResponse({ type: AccountResponse })
  @ApiForbiddenResponse({
    description: 'not-account-member: no perteneces a la cuenta',
  })
  @ApiNotFoundResponse({
    description: 'account-not-found: no existe o está borrada',
  })
  async update(
    @Param('id') id: string,
    @Body() request: AccountUpdateRequest,
    @CurrentUser() user: User,
  ): Promise<AccountResponse> {
    return this.transactionExecutor.execute(async () => {
      const command = new AccountUpdateCommand(
        new AccountUpdate(this.accountRepository, this.buildAccountFindById()),
        this.buildEnsureAccountMember(),
      );

      return command.execute({ request, id, user });
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Borrar una cuenta',
    description: 'Borrado lógico: se puede restaurar y no toca las membresías.',
  })
  @ApiOkResponse({ type: AccountResponse })
  @ApiForbiddenResponse({
    description:
      'not-account-member | insufficient-account-role: solo un owner puede borrar la cuenta',
  })
  @ApiNotFoundResponse({
    description: 'account-not-found: no existe o ya estaba borrada',
  })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<AccountResponse> {
    return this.transactionExecutor.execute(async () => {
      const command = new AccountDeleteCommand(
        new AccountDelete(this.accountRepository, this.buildAccountFindById()),
        this.buildEnsureAccountRole(),
      );

      return command.execute({ id, user });
    });
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restaurar una cuenta borrada' })
  @ApiOkResponse({ type: AccountResponse })
  @ApiForbiddenResponse({
    description:
      'not-account-member | insufficient-account-role: solo un owner puede restaurar la cuenta',
  })
  @ApiNotFoundResponse({ description: 'account-not-found: no existe' })
  @ApiConflictResponse({
    description: 'account-already-active: la cuenta no estaba borrada',
  })
  async restore(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<AccountResponse> {
    return this.transactionExecutor.execute(async () => {
      const command = new AccountRestoreCommand(
        new AccountRestore(this.accountRepository, this.buildAccountFindById()),
        this.buildEnsureAccountRole(),
      );

      return command.execute({ id, user });
    });
  }

  @Get(':accountId/members')
  @ApiOperation({ summary: 'Listar los miembros de una cuenta y su rol' })
  @ApiPaginatedResponse(AccountMemberResponse)
  @ApiForbiddenResponse({
    description: 'not-account-member: no perteneces a la cuenta',
  })
  async findMembers(
    @Param('accountId') accountId: string,
    @Query() request: AccountMembershipGetByAccountRequest,
    @CurrentUser() user: User,
  ): Promise<PaginationResponse<AccountMemberResponse>> {
    const query = new AccountMembershipGetByAccount(
      this.accountMembershipRepository,
      this.buildEnsureAccountMember(),
    );

    return query.execute({ request, accountId, user });
  }

  @Get(':accountId/members/:userId')
  @ApiOperation({ summary: 'Obtener un miembro concreto de una cuenta' })
  @ApiOkResponse({ type: AccountMemberResponse })
  @ApiForbiddenResponse({
    description: 'not-account-member: no perteneces a la cuenta',
  })
  @ApiNotFoundResponse({
    description:
      'account-membership-not-found: ese usuario no es miembro activo de la cuenta',
  })
  async findMember(
    @Param('accountId') accountId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: User,
  ): Promise<AccountMemberResponse> {
    const query = new AccountMembershipGetByAccountAndUser(
      this.buildFindByAccountAndUser(),
      this.buildEnsureAccountMember(),
    );

    return query.execute({ accountId, userId, user });
  }

  @Patch(':accountId/members/:userId/role')
  @ApiOperation({
    summary: 'Promover o degradar a un miembro',
    description:
      'Un owner puede degradarse a sí mismo. Si era el último owner, se promueve al miembro activo más antiguo.',
  })
  @ApiOkResponse({ type: AccountMemberResponse })
  @ApiForbiddenResponse({
    description:
      'not-account-member | insufficient-account-role: solo un owner puede cambiar roles',
  })
  @ApiNotFoundResponse({
    description:
      'account-not-found | account-membership-not-found: la cuenta está borrada, o ese usuario no es miembro activo',
  })
  @ApiConflictResponse({
    description:
      'account-requires-owner: degradarías al único owner y no queda ningún miembro al que promover',
  })
  async updateMemberRole(
    @Param('accountId') accountId: string,
    @Param('userId') userId: string,
    @Body() request: AccountMembershipUpdateRoleRequest,
    @CurrentUser() user: User,
  ): Promise<AccountMemberResponse> {
    return this.transactionExecutor.execute(async () => {
      const command = new AccountMembershipUpdateRoleCommand(
        new AccountMembershipUpdateRole(
          this.accountMembershipRepository,
          new AccountMembershipFindById(this.accountMembershipRepository),
          new AccountMembershipUpdateOwners(this.accountMembershipRepository),
        ),
        this.buildFindByAccountAndUser(),
        this.buildAccountFindById(),
        this.buildEnsureAccountRole(),
      );

      return command.execute({ request, accountId, userId, user });
    });
  }

  @Delete(':accountId/members/:userId')
  @ApiOperation({
    summary: 'Expulsar a un miembro, o salirse de la cuenta',
    description:
      'Si el miembro eres tú, basta con pertenecer a la cuenta; para expulsar a otro hay que ser owner. Si el afectado era el último owner, se promueve al miembro activo más antiguo.',
  })
  @ApiOkResponse({ type: AccountMemberResponse })
  @ApiForbiddenResponse({
    description:
      'not-account-member | insufficient-account-role: solo un owner puede expulsar a otro miembro',
  })
  @ApiNotFoundResponse({
    description:
      'account-not-found | account-membership-not-found: la cuenta está borrada, o ese usuario no es miembro activo',
  })
  @ApiConflictResponse({
    description:
      'last-member-cannot-be-removed: eres el único miembro, borra la cuenta en su lugar | account-requires-owner',
  })
  async deleteMember(
    @Param('accountId') accountId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: User,
  ): Promise<AccountMemberResponse> {
    return this.transactionExecutor.execute(async () => {
      const service = new AccountMembershipDelete(
        this.accountMembershipRepository,
        new AccountMembershipFindById(this.accountMembershipRepository),
        new AccountMembershipEnsureNotLastMember(
          this.accountMembershipRepository,
        ),
        new AccountMembershipUpdateOwners(this.accountMembershipRepository),
      );

      if (userId === user.getId()) {
        const command = new AccountMembershipLeaveCommand(
          service,
          this.buildAccountFindById(),
          this.buildEnsureAccountMember(),
        );

        return command.execute({ accountId, user });
      }

      const command = new AccountMembershipRemoveCommand(
        service,
        this.buildFindByAccountAndUser(),
        this.buildAccountFindById(),
        this.buildEnsureAccountRole(),
      );

      return command.execute({ accountId, userId, user });
    });
  }

  private buildAccountFindById(): AccountFindById {
    return new AccountFindById(this.accountRepository);
  }

  private buildFindByAccountAndUser(): AccountMembershipFindByAccountAndUser {
    return new AccountMembershipFindByAccountAndUser(
      this.accountMembershipRepository,
    );
  }

  private buildEnsureAccountMember(): EnsureAccountMember {
    return new EnsureAccountMember(this.buildFindByAccountAndUser());
  }

  private buildEnsureAccountRole(): EnsureAccountRole {
    return new EnsureAccountRole(this.buildEnsureAccountMember());
  }
}
