import { Request } from 'express';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const DeviceIdentifier = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const deviceIdentifier = request.headers['x-device-identifier'];

    if (!deviceIdentifier) {
      throw new Error('Device identifier not provided');
    }

    return deviceIdentifier;
  },
);
