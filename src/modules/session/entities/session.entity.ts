import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
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
