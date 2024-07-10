import { Global, Module } from '@nestjs/common';
import { ThrottlerModule, seconds } from '@nestjs/throttler';

@Global()
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: seconds(1),
        limit: 3,
      },
      {
        name: 'medium',
        ttl: seconds(10),
        limit: 20,
      },
      {
        name: 'long',
        ttl: seconds(60),
        limit: 100,
      },
    ]),
  ],
})
export class RateLimitingModule {}
