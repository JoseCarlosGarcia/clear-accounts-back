import { Model } from 'src/shared/infrastructure/typeorm/base.model';
import { Column, Entity } from 'typeorm';

@Entity()
export class UserModel extends Model{
  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text', select: false })
  password: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'bool', default: true })
  active: boolean;
}
