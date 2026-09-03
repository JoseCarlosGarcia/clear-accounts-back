import IdGenerator from 'src/shared/domain/interfaces/id.generator';
import { AccountRole } from '../../enums/account-role';
import { AccountMembership } from '../../entities/account-membership.entity';
import { UserAlreadyMemberException } from '../../exceptions/account';
import { IAccountMembershipRepository } from '../../repositories/account-membership.repository';
import { AccountFindById } from '../account/account-find-by-id';
import { UserFindById } from 'src/user/domain/services/user-find-by-id';

interface Props {
  userId: string;
  accountId: string;
  role: AccountRole;
}

export class AccountMembershipCreate {
  constructor(
    private readonly repository: IAccountMembershipRepository,
    private readonly accountFindById: AccountFindById,
    private readonly userFindById: UserFindById,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(props: Props): Promise<AccountMembership> {
    const account = await this.accountFindById.executeOrFail({
      id: props.accountId,
      isActive: true,
    });

    const user = await this.userFindById.executeOrFail({
      id: props.userId,
      isActive: true,
    });

    const existing = await this.repository.findByAccountAndUser(
      account.getId(),
      user.getId(),
    );

    if (existing) throw new UserAlreadyMemberException();

    const accountMembership = new AccountMembership({
      id: this.idGenerator.create(),
      account: account,
      user: user,
      role: props.role,
      createdAt: new Date(),
      active: true,
    });
    await this.repository.save(accountMembership);
    return accountMembership;
  }
}
