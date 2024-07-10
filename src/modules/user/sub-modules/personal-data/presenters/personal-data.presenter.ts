import { PersonalData } from '@/modules/user/sub-modules/personal-data/entities/personal-data.entity';

export class PersonalDataPresenter {
  id!: string;
  firstName!: string;
  lastName!: string;
  dateOfBirth!: Date;

  constructor(data: Partial<PersonalDataPresenter>) {
    Object.assign(this, data);
  }

  present(data: PersonalData[]): PersonalDataPresenter[];
  present(data: PersonalData): PersonalDataPresenter;
  present(
    data: PersonalData | PersonalData[],
  ): PersonalDataPresenter | PersonalDataPresenter[] {
    if (Array.isArray(data)) {
      return data.map((user) => new PersonalDataPresenter({}).present(user));
    } else {
      this.id = data.id;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.dateOfBirth = data.dateOfBirth;

      return this;
    }
  }
}
