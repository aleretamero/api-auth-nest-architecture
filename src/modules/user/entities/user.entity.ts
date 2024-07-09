import { Column, Entity, OneToMany, PrimaryColumn, Unique } from 'typeorm';
import { ID } from '@/common/shared/id';
import { Session } from '@/modules/session/entities/session.entity';
import { UserCode } from '@/modules/user-code/entities/user-code.entity';

@Entity('users')
export class User {
  @PrimaryColumn('varchar', { primaryKeyConstraintName: 'USER_PK' })
  id!: string;

  @Column('varchar')
  @Unique('USER_EMAIL_UK', ['email'])
  email!: string;

  @Column('varchar', { name: 'password_hash' })
  passwordHash!: string;

  @Column('varchar', { name: 'avatar_path', nullable: true })
  avatarPath?: string | null;

  @Column('varchar', { name: 'avatar_url', nullable: true })
  avatarUrl?: string | null;

  @Column('boolean', { name: 'email_verified', default: false })
  emailVerified!: boolean;

  @OneToMany(() => Session, (x) => x.user, {
    cascade: true,
  })
  sessions?: Session[];

  @OneToMany(() => UserCode, (x) => x.user, {
    cascade: true,
  })
  userCodes?: UserCode[];

  constructor(partialEntity: Partial<User>) {
    Object.assign(this, partialEntity);

    if (!this.id) {
      this.id = ID.generate();
    }
  }
}
