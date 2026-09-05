import { AccountRole } from 'src/account/domain/enums/account-role';
import { Model } from 'src/shared/infrastructure/typeorm/base.model';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user.model';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AccountModel } from './account.model';

@Entity()
export class AccountMembershipModel extends Model {
  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @Column()
  user_id: string;

  @ManyToOne(() => AccountModel)
  @JoinColumn({ name: 'account_id' })
  account: AccountModel;

  @Column()
  account_id: string;

  @Column({ type: 'enum', enum: AccountRole })
  role: AccountRole;

  @Column({ type: 'bool', default: true })
  active: boolean;
}
