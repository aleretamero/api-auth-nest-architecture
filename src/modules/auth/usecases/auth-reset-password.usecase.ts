import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { SessionService } from '@/modules/user/sub-modules/session/session.service';
import { AuthResetPasswordDto } from '@/modules/auth/dtos/auth-reset-password.dto';
import { HashService } from '@/infra/hash/hash.service';
import { UserCodeType } from '@/modules/user/sub-modules/user-code/enums/user-code-type.enum';
import { SessionPresenter } from '@/modules/user/sub-modules/session/presenters/session.presenter';
import { UserCodeService } from '@/modules/user/sub-modules/user-code/user-code.service';

@Injectable()
export class AuthResetPasswordUsecase {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly hashService: HashService,
    private readonly sessionService: SessionService,
    private readonly userCodeService: UserCodeService,
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

    const isValid = await this.userCodeService.confirm(
      user,
      UserCodeType.FORGOT_PASSWORD,
      authResetPasswordDto.code,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid code');
    }

    const passwordHash = await this.hashService.hash(
      authResetPasswordDto.password,
    );

    await this.typeormService.user.update(user.id, {
      passwordHash,
    });

    return await this.sessionService.create(user, deviceIdentifier);
  }
}
