import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { UserCodeType } from '@/modules/user/sub-modules/user-code/enums/user-code-type.enum';
import { AuthConfirmForgotPasswordDto } from '../dtos/auth-confirm-forgot-password.dto';
import { UserCodeService } from '@/modules/user/sub-modules/user-code/user-code.service';

@Injectable()
export class AuthConfirmForgotPasswordUsecase {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly userCodeService: UserCodeService,
  ) {}

  async execute(
    authConfirmForgotPasswordDto: AuthConfirmForgotPasswordDto,
  ): Promise<void> {
    const user = await this.typeormService.user.findOne({
      where: {
        email: authConfirmForgotPasswordDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await this.userCodeService.confirm(
      user,
      UserCodeType.FORGOT_PASSWORD,
      authConfirmForgotPasswordDto.code,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid code');
    }
  }
}
