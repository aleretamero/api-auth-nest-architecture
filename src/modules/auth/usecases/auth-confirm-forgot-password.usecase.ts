import { BadRequestException, Injectable } from '@nestjs/common';
import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { UserCodeStatus } from '@/modules/user-code/enums/user-code-status.enum';
import { UserCodeType } from '@/modules/user-code/enums/user-code-type.enum';
import { AuthConfirmForgotPasswordDto } from '../dtos/auth-confirm-forgot-password.dto';

@Injectable()
export class AuthConfirmForgotPasswordUsecase {
  constructor(private readonly typeormService: TypeormService) {}

  async execute(
    authConfirmForgotPasswordDto: AuthConfirmForgotPasswordDto,
  ): Promise<void> {
    const userCode = await this.typeormService.userCode.findOne({
      where: {
        user: { email: authConfirmForgotPasswordDto.email },
        status: UserCodeStatus.PENDING,
        type: UserCodeType.RESET_PASSWORD,
        code: authConfirmForgotPasswordDto.code,
      },
    });

    if (!userCode) {
      throw new BadRequestException('Invalid parameters');
    }

    await this.typeormService.userCode.update(userCode.id, {
      status: UserCodeStatus.VERIFIED,
    });
  }
}
