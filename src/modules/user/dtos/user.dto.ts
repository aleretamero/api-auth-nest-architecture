import { User } from '@/modules/user/entities/user.entity';
import { PersonalDataDto } from '@/modules/user/sub-modules/personal-data/dto/personal-data.dto';
import { Role } from '@/modules/user/enums/role.enum';

export class UserDto {
  id: string;
  email: string;
  avatarUrl?: string;
  roles?: Role[];
  personalData?: PersonalDataDto;

  constructor(data: User) {
    this.id = data.id;
    this.email = data.email;
    this.avatarUrl = data.avatarUrl ?? undefined;
    this.roles = data.roles;
    this.personalData = data.personalData
      ? new PersonalDataDto(data.personalData)
      : undefined;
  }
}
