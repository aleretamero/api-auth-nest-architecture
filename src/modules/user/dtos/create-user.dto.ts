import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { CreatePersonalDataDto } from '../sub-modules/personal-data/dto/create-personal-data.dto';
import { Transform, Type } from 'class-transformer';
import { Role } from '@/modules/user/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
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
  @Type(() => CreatePersonalDataDto)
  personalData?: CreatePersonalDataDto;

  @Transform(({ value }) => value && parseInt(value))
  @IsOptional()
  @IsIn([Role.ADMIN, Role.USER])
  role?: typeof Role.ADMIN | typeof Role.USER;
}
