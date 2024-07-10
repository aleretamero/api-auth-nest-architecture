import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { HashService } from '@/infra/hash/hash.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@/infra/jwt/jwt.service';
import { User } from '@/modules/user/entities/user.entity';
import { SessionPresenter } from '@/modules/user/sub-modules/session/presenters/session.presenter';

@Injectable()
export class SessionService {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly sessionPresenter: SessionPresenter,
  ) {}

  async create(
    user: User,
    deviceIdentifier: string,
  ): Promise<SessionPresenter> {
    const sessionsCount = await this.typeormService.session.count({
      where: {
        userId: user.id,
        deviceIdentifier,
      },
    });

    if (sessionsCount > 0) {
      await this.typeormService.session.delete({
        userId: user.id,
        deviceIdentifier,
      });
    }

    const accessToken = await this.jwtService.sign({
      issuer: 'ACCESS_TOKEN',
      subject: user.id,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.sign({
      issuer: 'REFRESH_TOKEN',
      subject: user.id,
      expiresIn: '7d',
    });

    const hashedAccessToken = await this.hashService.hash(accessToken);
    const hashedRefreshToken = await this.hashService.hash(refreshToken);

    const session = this.typeormService.session.create({
      user,
      deviceIdentifier,
      accessToken: hashedAccessToken,
      refreshToken: hashedRefreshToken,
    });

    await this.typeormService.session.save(session);

    return this.sessionPresenter.present({
      accessToken,
      refreshToken,
    });
  }

  async remove(user: User, deviceIdentifier: string): Promise<void> {
    await this.typeormService.session.delete({
      userId: user.id,
      deviceIdentifier,
    });
  }
}
