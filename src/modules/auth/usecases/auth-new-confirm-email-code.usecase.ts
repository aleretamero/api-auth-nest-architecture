import { Injectable, NotFoundException } from '@nestjs/common';
import { UserCodeType } from '@/modules/user/sub-modules/user-code/enums/user-code-type.enum';
import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { UserCodeService } from '@/modules/user/sub-modules/user-code/user-code.service';
import { AuthNewConfirmEmailCodeQueue } from '@/modules/auth/queues/auth-new-confirm-email-code.queue';

@Injectable()
export class AuthNewConfirmEmailCodeCodeUsecase {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly userCodeService: UserCodeService,
    private readonly authNewEmailConfirmationCodeQueue: AuthNewConfirmEmailCodeQueue,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.typeormService.user.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const code = await this.userCodeService.create(
      user,
      UserCodeType.EMAIL_VERIFICATION,
    );

    await this.authNewEmailConfirmationCodeQueue.add({
      email: user.email,
      code,
    });
  }
}
