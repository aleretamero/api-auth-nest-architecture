import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ID } from '@/common/helpers/id';
import { User } from '@/modules/user/entities/user.entity';

@Entity('personal_data')
export class PersonalData {
  @PrimaryColumn('varchar')
  id!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column({ name: 'date_of_birth' })
  dateOfBirth!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'user_id' })
  userId!: string;

  @OneToOne(() => User, (x) => x.personalData, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    deferrable: 'INITIALLY DEFERRED',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  constructor(partialEntity: Partial<PersonalData>) {
    Object.assign(this, partialEntity);

    if (!this.id) {
      this.id = ID.generate();
    }
  }
}
