import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdatePersonalDataDto } from '@/modules/user/sub-modules/personal-data/dto/update-personal-data.dto';
import { Role } from '@/modules/user/enums/role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  email!: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePersonalDataDto)
  personalData?: UpdatePersonalDataDto;

  @Transform(({ value }) => value && parseInt(value))
  @IsOptional()
  @IsIn([Role.ADMIN, Role.USER])
  role?: typeof Role.ADMIN | typeof Role.USER;
}
