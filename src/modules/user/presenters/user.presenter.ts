import { User } from '@/modules/user/entities/user.entity';
import { PersonalDataPresenter } from '../sub-modules/personal-data/presenters/personal-data.presenter';

export class UserPresenter {
  id!: string;
  email!: string;
  avatarUrl?: string;
  personalData?: PersonalDataPresenter;

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
      this.personalData = data.personalData
        ? new PersonalDataPresenter({}).present(data.personalData)
        : undefined;

      return this;
    }
  }
}
