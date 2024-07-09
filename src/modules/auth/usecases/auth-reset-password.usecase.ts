import { Injectable, NotFoundException } from '@nestjs/common';
import { In } from 'typeorm';
import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { SessionService } from '@/modules/session/session.service';
import { AuthResetPasswordDto } from '@/modules/auth/dtos/auth-reset-password.dto';
import { HashService } from '@/infra/hash/hash.service';
import { UserCodeStatus } from '@/modules/user-code/enums/user-code-status.enum';
import { UserCodeType } from '@/modules/user-code/enums/user-code-type.enum';
import { SessionPresenter } from '@/modules/session/presenters/session.presenter';

@Injectable()
export class AuthResetPasswordUsecase {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly hashService: HashService,
    private readonly sessionService: SessionService,
  ) {}

  async execute(
    deviceIdentifier: string,
    authResetPasswordDto: AuthResetPasswordDto,
  ): Promise<SessionPresenter> {
    const user = await this.typeormService.user.findOne({
      where: { email: authResetPasswordDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userCode = await this.typeormService.userCode.findOne({
      where: {
        user: { id: user.id },
        status: In([UserCodeStatus.PENDING, UserCodeStatus.VERIFIED]),
        type: UserCodeType.RESET_PASSWORD,
        code: authResetPasswordDto.code,
      },
    });

    if (!userCode) {
      throw new NotFoundException('Invalid code');
    }

    const passwordHash = await this.hashService.hash(
      authResetPasswordDto.password,
    );

    await this.typeormService.user.update(userCode.userId, {
      passwordHash,
    });

    await this.typeormService.userCode.update(userCode.id, {
      status: UserCodeStatus.USED,
    });

    return await this.sessionService.create(user, deviceIdentifier);
  }
}
