import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { HashService } from '@/infra/hash/hash.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@/infra/jwt/jwt.service';
import { User } from '@/modules/user/entities/user.entity';
import { SessionDto } from '@/modules/user/sub-modules/session/dtos/session.dto';

@Injectable()
export class SessionService {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async create(user: User, deviceIdentifier: string): Promise<SessionDto> {
    const sessionsCount = await this.typeormService.session.count({
      where: {
        userId: user.id,
        deviceIdentifier,
      },
    });

    if (sessionsCount > 0) {
      await this.remove(user, deviceIdentifier);
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

    return new SessionDto(accessToken, refreshToken);
  }

  async remove(user: User, deviceIdentifier: string): Promise<void> {
    await this.typeormService.session.delete({
      userId: user.id,
      deviceIdentifier,
    });
  }
}
