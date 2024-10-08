import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { JwtService } from '@/infra/jwt/jwt.service';
import { IS_PUBLIC_KEY } from '@/common/decorators/is-public.decorator';
import { I18nService } from '@/infra/i18n/i18n.service';
import { HashService } from '@/infra/hash/hash.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly datasource: DataSource,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly i18nService: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    const deviceIdentifier = this.extractDeviceIdentifierFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        this.i18nService.t('auth.token.not_found_or_invalid'),
      );
    }

    if (!deviceIdentifier) {
      throw new UnauthorizedException(
        this.i18nService.t('auth.device_identifier.not_found'),
      );
    }

    try {
      const payload = await this.jwtService.verify(token);

      if (payload.iss !== 'ACCESS_TOKEN') {
        throw new UnauthorizedException();
      }

      const session = await this.datasource.getRepository('sessions').findOne({
        where: { deviceIdentifier, userId: payload.sub },
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
        session.accessToken,
      );

      if (!isMatch) throw new UnauthorizedException();

      request.user = session.user;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractDeviceIdentifierFromHeader(
    request: Request,
  ): string | undefined {
    return typeof request.headers['x-device-identifier'] === 'string'
      ? request.headers['x-device-identifier']
      : undefined;
  }
}
