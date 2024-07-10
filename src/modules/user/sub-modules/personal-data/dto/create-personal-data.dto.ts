import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreatePersonalDataDto {
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  @IsDate()
  dateOfBirth!: Date;
}
