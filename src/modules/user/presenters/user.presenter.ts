import { User } from '@/modules/user/entities/user.entity';

export class UserPresenter {
  public id!: string;
  public email!: string;
  public avatarUrl?: string;

  constructor(data: Partial<UserPresenter>) {
    Object.assign(this, data);
  }

  present(data: User): UserPresenter {
    this.id = data.id;
    this.email = data.email;
    this.avatarUrl = data.avatarUrl ?? undefined;

    return this;
  }
}
