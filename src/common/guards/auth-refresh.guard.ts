import { Request } from 'express';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@/infra/jwt/jwt.service';
import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { I18nService } from '@/infra/i18n/i18n.service';
import { HashService } from '@/infra/hash/hash.service';

@Injectable()
export class AuthRefreshGuard implements CanActivate {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly i18nService: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    const deviceIdentifier = this.extractDeviceIdentifierFromHeader(request);

    if (!token) {
      throw new BadRequestException(
        this.i18nService.t('auth.token.not_found_or_invalid'),
      );
    }

    if (!deviceIdentifier) {
      throw new BadRequestException(
        this.i18nService.t('auth.device_identifier.not_found'),
      );
    }

    try {
      const payload = await this.jwtService.verify(token);

      const session = await this.typeormService.session.findOne({
        where: { deviceIdentifier, userId: payload.subject },
        relations: {
          user: true,
        },
      });

      if (!session || !session.user) {
        throw new UnauthorizedException(
          this.i18nService.t('user.session.not_found'),
        );
      }

      const isMatch = await this.hashService.compare(
        token,
        session.refreshToken,
      );

      if (!isMatch) return false;

      request.user = session.user;
    } catch {
      throw new BadRequestException(
        this.i18nService.t('auth.token.not_found_or_invalid'),
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return typeof request.headers['refresh-token'] === 'string'
      ? request.headers['refresh-token']
      : undefined;
  }

  private extractDeviceIdentifierFromHeader(
    request: Request,
  ): string | undefined {
    return request.headers['device-identifier'] === 'string'
      ? request.headers['device-identifier']
      : undefined;
  }
}