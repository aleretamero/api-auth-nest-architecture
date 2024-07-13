import { User } from '@/modules/user/entities/user.entity';
import { PersonalDataDto } from '@/modules/user/sub-modules/personal-data/dto/personal-data.dto';

export class UserDto {
  id: string;
  email: string;
  avatarUrl?: string;
  personalData?: PersonalDataDto;

  constructor(data: User) {
    this.id = data.id;
    this.email = data.email;
    this.avatarUrl = data.avatarUrl ?? undefined;
    this.personalData = data.personalData
      ? new PersonalDataDto(data.personalData)
      : undefined;
  }
}
