import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { UserCodeType } from '@/modules/user/sub-modules/user-code/enums/user-code-type.enum';
import { AuthConfirmEmailDto } from '@/modules/auth/dtos/auth-confirm-email.dto';
import { UserCodeService } from '@/modules/user/sub-modules/user-code/user-code.service';

@Injectable()
export class AuthConfirmEmailUsecase {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly userCodeService: UserCodeService,
  ) {}

  async execute(authConfirmEmailDto: AuthConfirmEmailDto): Promise<void> {
    const user = await this.typeormService.user.findOne({
      where: {
        email: authConfirmEmailDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await this.userCodeService.confirm(
      user,
      UserCodeType.EMAIL_VERIFICATION,
      authConfirmEmailDto.code,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid code');
    }

    await this.typeormService.user.update(user.id, {
      emailVerified: true,
    });
  }
}
