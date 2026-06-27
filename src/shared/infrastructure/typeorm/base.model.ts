import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export class Model {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
