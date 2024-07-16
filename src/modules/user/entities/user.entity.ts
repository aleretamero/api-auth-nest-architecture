import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ID } from '@/common/helpers/id';
import { Session } from '@/modules/user/sub-modules/session/entities/session.entity';
import { UserCode } from '@/modules/user/sub-modules/user-code/entities/user-code.entity';
import { PersonalData } from '@/modules/user/sub-modules/personal-data/entities/personal-data.entity';
import { Role } from '@/modules/user/enums/role.enum';

@Entity('users')
export class User {
  @PrimaryColumn('varchar')
  id!: string;

  @Column('varchar')
  @Unique(['email'])
  email!: string;

  @Column('varchar', { name: 'password_hash' })
  passwordHash!: string;

  @Column('varchar', { name: 'avatar_path', nullable: true })
  avatarPath?: string | null;

  @Column('varchar', { name: 'avatar_url', nullable: true })
  avatarUrl?: string | null;

  @Column('boolean', { name: 'email_verified', default: false })
  emailVerified!: boolean;

  @Column('json', { default: [Role.USER] })
  roles!: Role[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Session, (x) => x.user, {
    cascade: true,
  })
  sessions?: Session[];

  @OneToMany(() => UserCode, (x) => x.user, {
    cascade: true,
  })
  userCodes?: UserCode[];

  @OneToOne(() => PersonalData, (x) => x.user, {
    cascade: true,
  })
  personalData?: PersonalData | null;

  constructor(partialEntity: Partial<User>) {
    Object.assign(this, partialEntity);

    if (!this.id) {
      this.id = ID.generate();
    }
  }
}
