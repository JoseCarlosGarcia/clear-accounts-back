import { Model } from 'src/shared/infrastructure/typeorm/base.model';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user.model';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class AccountModel extends Model {
  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserModel;

  @Column()
  created_by_id: string;

  @Column({ type: 'varchar'})
  name: string;

  @Column({ type: 'varchar'})
  color: string;

  @Column({ type: 'double precision'})
  initialBalance: number;

  @Column({ type: 'bool', default: true })
  active: boolean;
}
