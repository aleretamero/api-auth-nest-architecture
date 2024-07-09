import { BadRequestException, Injectable } from '@nestjs/common';
import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { UserCodeStatus } from '@/modules/user-code/enums/user-code-status.enum';
import { UserCodeType } from '@/modules/user-code/enums/user-code-type.enum';
import { AuthConfirmEmailDto } from '@/modules/auth/dtos/auth-confirm-email.dto';

@Injectable()
export class AuthConfirmEmailUsecase {
  constructor(private readonly typeormService: TypeormService) {}

  async execute(authConfirmEmailDto: AuthConfirmEmailDto): Promise<void> {
    const userCode = await this.typeormService.userCode.findOne({
      where: {
        user: { email: authConfirmEmailDto.email },
        status: UserCodeStatus.PENDING,
        type: UserCodeType.EMAIL_VERIFICATION,
        code: authConfirmEmailDto.code,
      },
    });

    if (!userCode) {
      throw new BadRequestException('Invalid parameters');
    }

    await this.typeormService.user.update(userCode.userId, {
      emailVerified: true,
    });

    await this.typeormService.userCode.update(userCode.id, {
      status: UserCodeStatus.VERIFIED,
    });
  }
}
