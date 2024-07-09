import { BadRequestException, Injectable } from '@nestjs/common';
import { HashService } from '@/infra/hash/hash.service';
import { AuthLoginDto } from '@/modules/auth/dtos/auth-login.dto';
import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { SessionService } from '@/modules/session/session.service';
import { SessionPresenter } from '@/modules/session/presenters/session.presenter';

@Injectable()
export class AuthLoginUsecase {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly hashService: HashService,
    private readonly sessionService: SessionService,
  ) {}

  async execute(
    deviceIdentifier: string,
    authLoginDto: AuthLoginDto,
  ): Promise<SessionPresenter> {
    const user = await this.typeormService.user.findOne({
      where: { email: authLoginDto.email },
    });

    if (!user) {
      throw new BadRequestException('Email or password is incorrect');
    }

    const isMatch = await this.hashService.compare(
      authLoginDto.password,
      user.passwordHash,
    );

    if (!isMatch) {
      throw new BadRequestException('Email or password is incorrect');
    }

    return await this.sessionService.create(user, deviceIdentifier);
  }
}
