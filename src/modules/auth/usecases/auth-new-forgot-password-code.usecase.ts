import { Injectable, NotFoundException } from '@nestjs/common';
import { UserCodeType } from '@/modules/user-code/enums/user-code-type.enum';
import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { UserCodeService } from '@/modules/user-code/user-code.service';

@Injectable()
export class AuthNewForgotPasswordCodeUsecase {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly userCodeService: UserCodeService,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.typeormService.user.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userCodeService.create(user, UserCodeType.RESET_PASSWORD);
  }
}
