import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const DeviceIdentifier = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request.headers['device-identifier'];
  },
);
