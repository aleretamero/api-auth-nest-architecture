import { Request } from 'express';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '@/modules/user/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (filter: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) {
      throw new Error('User not found in request context.');
    }

    if (filter) {
      return request.user[filter];
    }

    return request.user;
  },
);
