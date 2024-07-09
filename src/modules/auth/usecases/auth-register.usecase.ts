import { BadRequestException, Injectable } from '@nestjs/common';
import { HashService } from '@/infra/hash/hash.service';
import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { SessionService } from '@/modules/session/session.service';
import { AuthRegisterDto } from '@/modules/auth/dtos/auth-register.dto';
import { UserCodeService } from '@/modules/user-code/user-code.service';
import { UserCodeType } from '@/modules/user-code/enums/user-code-type.enum';
import { SessionPresenter } from '@/modules/session/presenters/session.presenter';

@Injectable()
export class AuthRegisterUsecase {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly hashService: HashService,
    private readonly userCodeService: UserCodeService,
    private readonly sessionService: SessionService,
  ) {}

  async execute(
    deviceIdentifier: string,
    authRegisterDto: AuthRegisterDto,
  ): Promise<SessionPresenter> {
    const userExists = await this.typeormService.user.existsBy({
      email: authRegisterDto.email,
    });

    if (userExists) {
      throw new BadRequestException('Email already registered.');
    }

    const passwordHash = await this.hashService.hash(authRegisterDto.password);

    const user = this.typeormService.user.create({
      email: authRegisterDto.email,
      passwordHash,
    });

    await this.userCodeService.create(user, UserCodeType.EMAIL_VERIFICATION);

    // TODO: Send email with code

    await this.typeormService.user.save(user);

    return await this.sessionService.create(user, deviceIdentifier);
  }
}
