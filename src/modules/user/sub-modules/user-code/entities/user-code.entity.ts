import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { UserCodeStatus } from '@/modules/user/sub-modules/user-code/enums/user-code-status.enum';
import { UserCodeType } from '@/modules/user/sub-modules/user-code/enums/user-code-type.enum';
import { ID } from '@/common/shared/id';

@Entity('user_codes')
export class UserCode {
  @PrimaryColumn('varchar', { primaryKeyConstraintName: 'USER_CODE_PK' })
  id!: string;

  @Column('varchar', { name: 'user_id' })
  userId!: string;

  @Column('smallint')
  type!: UserCodeType;

  @Column('smallint', { default: UserCodeStatus.PENDING })
  status!: UserCodeStatus;

  @Column('varchar')
  code!: string;

  @Column('bigint', { name: 'expires_in' })
  expiresIn!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (x) => x.userCodes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    deferrable: 'INITIALLY DEFERRED',
  })
  @JoinColumn({
    foreignKeyConstraintName: 'USER_CODE_USER_FK',
    name: 'user_id',
  })
  user?: User;

  constructor(partialEntity: Partial<UserCode>) {
    Object.assign(this, partialEntity);

    if (!this.id) {
      this.id = ID.generate();
    }
  }
}
