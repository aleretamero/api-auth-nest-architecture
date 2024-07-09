import { IsLength } from '@/common/validators/is-length-validator';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class AuthConfirmForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @IsLength(6)
  @IsNotEmpty()
  code!: string;
}
