import { User } from '@/modules/user/entities/user.entity';

export class UserPresenter {
  public id!: string;
  public email!: string;
  public avatarUrl?: string;

  constructor(data: Partial<UserPresenter>) {
    Object.assign(this, data);
  }

  present(data: User[]): UserPresenter[];
  present(data: User): UserPresenter;
  present(data: User | User[]): UserPresenter | UserPresenter[] {
    if (Array.isArray(data)) {
      return data.map((user) => new UserPresenter({}).present(user));
    } else {
      this.id = data.id;
      this.email = data.email;
      this.avatarUrl = data.avatarUrl ?? undefined;

      return this;
    }
  }
}
