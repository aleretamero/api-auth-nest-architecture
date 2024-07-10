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

@Entity('sessions')
export class Session {
  @PrimaryColumn({
    name: 'device_identifier',
    primaryKeyConstraintName: 'SESSION_PK',
  })
  deviceIdentifier!: string;

  @PrimaryColumn({ name: 'user_id', primaryKeyConstraintName: 'SESSION_PK' })
  userId!: string;

  @Column({ name: 'access_token' })
  accessToken!: string;

  @Column({ name: 'refresh_token' })
  refreshToken!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (x) => x.sessions, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    deferrable: 'INITIALLY DEFERRED',
  })
  @JoinColumn({
    foreignKeyConstraintName: 'SESSION_USER_FK',
    name: 'user_id',
  })
  user?: User;

  constructor(partialEntity: Partial<Session>) {
    Object.assign(this, partialEntity);
  }
}
