import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

namespace JwtService {
  export type Options<T extends object | Buffer> = {
    expiresIn?: string | number;
    issuer?: string;
    subject?: string;
  } & { payload?: T };
}

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  async sign<T extends object | Buffer>(
    options: JwtService.Options<T> = {},
  ): Promise<string> {
    const { payload, ...rest } = options;

    return this.jwtService.sign(payload ?? {}, rest);
  }

  async verify<T extends object>(
    token: string,
  ): Promise<JwtService.Options<T>> {
    return this.jwtService.verify<T>(token);
  }
}
