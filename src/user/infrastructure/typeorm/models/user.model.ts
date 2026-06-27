import { Model } from 'src/shared/infrastructure/typeorm/base.model';
import { Column, Entity } from 'typeorm';

@Entity()
export class UserModel extends Model{
  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'bool', default: false })
  deleted: boolean;
}
