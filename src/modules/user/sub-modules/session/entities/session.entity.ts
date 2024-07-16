import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';

@Entity('sessions')
export class Session {
  @PrimaryColumn('varchar', { name: 'device_identifier' })
  deviceIdentifier!: string;

  @PrimaryColumn('varchar', { name: 'user_id' })
  userId!: string;

  @Column('varchar', { name: 'access_token' })
  accessToken!: string;

  @Column('varchar', { name: 'refresh_token' })
  refreshToken!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => User, (x) => x.sessions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    deferrable: 'INITIALLY DEFERRED',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  constructor(partialEntity: Partial<Session>) {
    Object.assign(this, partialEntity);
  }
}
