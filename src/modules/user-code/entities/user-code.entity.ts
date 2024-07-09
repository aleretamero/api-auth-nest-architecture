import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { UserCodeStatus } from '@/modules/user-code/enums/user-code-status.enum';
import { UserCodeType } from '@/modules/user-code/enums/user-code-type.enum';
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

  @ManyToOne(() => User, (x) => x.userCodes, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
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
