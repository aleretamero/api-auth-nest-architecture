import { PersonalData } from '@/modules/user/sub-modules/personal-data/entities/personal-data.entity';

export class PersonalDataDto {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;

  constructor(data: PersonalData) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.dateOfBirth = data.dateOfBirth;
  }
}
