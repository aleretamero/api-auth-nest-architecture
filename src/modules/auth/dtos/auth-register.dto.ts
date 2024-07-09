import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';

export class AuthRegisterDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password!: string;
}
