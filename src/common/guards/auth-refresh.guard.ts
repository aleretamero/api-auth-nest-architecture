import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@/infra/jwt/jwt.service';
import { TypeormService } from '@/infra/database/postgres/typeorm.service';
// import { HashService } from '@/infra/hash/hash.service';

@Injectable()
export class AuthRefreshGuard implements CanActivate {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly jwtService: JwtService,
    // private readonly hashService: HashService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    const deviceIdentifier = this.extractDeviceIdentifierFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found or invalid');
    }

    if (!deviceIdentifier) {
      throw new UnauthorizedException('Device identifier not found');
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
        throw new UnauthorizedException('Session not found');
      }

      // TODO: Uncomment this code after implementing the hashService
      // const isMatch = await this.hashService.compare(
      //   token,
      //   session.accessToken,
      // );

      // if (!isMatch) return false;

      request.user = session.user;
    } catch {
      return false;
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
    return typeof request.headers['device-identifier'] === 'string'
      ? request.headers['device-identifier']
      : undefined;
  }
}
