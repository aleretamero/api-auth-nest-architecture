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
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
// import { HashService } from '@/infra/hash/hash.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly datasource: DataSource,
    private readonly jwtService: JwtService,
    // private readonly hashService: HashService,
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
      throw new UnauthorizedException('Token not found or invalid');
    }

    if (!deviceIdentifier) {
      throw new UnauthorizedException('Device identifier not found');
    }

    try {
      const payload = await this.jwtService.verify(token);

      const session = await this.datasource.getRepository('sessions').findOne({
        where: { deviceIdentifier, userId: payload.subject },
        relations: {
          user: true,
        },
      });

      if (!session || !session.user) {
        throw new UnauthorizedException('Token not found or invalid');
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
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractDeviceIdentifierFromHeader(
    request: Request,
  ): string | undefined {
    return typeof request.headers['device-identifier'] === 'string'
      ? request.headers['device-identifier']
      : undefined;
  }
}
