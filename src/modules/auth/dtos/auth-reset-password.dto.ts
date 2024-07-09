import { IsLength } from '@/common/validators/is-length-validator';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';

export class AuthResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @IsLength(6)
  code!: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password!: string;
}
