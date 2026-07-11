import { AccountRole } from 'src/account/domain/enums/account-type';
import { Model } from 'src/shared/infrastructure/typeorm/base.model';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user.model';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class AccountMembershipModel extends Model {
  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @Column()
  user_id: string;

  @Column()
  account_id: string;

  @Column({ type: 'enum', enum: AccountRole })
  role: AccountRole;

  @Column({ type: 'bool', default: true })
  active: boolean;
}
