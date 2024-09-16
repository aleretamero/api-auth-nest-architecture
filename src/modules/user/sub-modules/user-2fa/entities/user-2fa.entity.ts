import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { ID } from '@/common/helpers/id';

@Entity('user_2fa')
export class User2FA {
  @PrimaryColumn('varchar')
  id!: string;

  @Column('varchar', { nullable: true })
  secret?: string | null;

  @Column('varchar', { name: 'temp_secret', nullable: true })
  tempSecret?: string | null;

  @Column('bigint', { name: 'temp_secret_expiry', nullable: true })
  tempSecretExpiry?: number | null;

  @Column({ name: 'is_enabled', default: false })
  isEnabled!: boolean;

  @Column({ name: 'is_verified', default: false })
  isVerified!: boolean;

  @Column({ name: 'user_id' })
  userId!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updateAt!: Date;

  @OneToOne(() => User, (x) => x.user2FA, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    deferrable: 'INITIALLY DEFERRED',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  constructor(partialEntity: Partial<User2FA>) {
    Object.assign(this, partialEntity);

    if (!this.id) {
      this.id = ID.generate();
    }
  }
}
