import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';
import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CacheService } from '@/infra/cache/cache.service';
import { ClockUtil } from '@/common/helpers/clock-util';

@Module({
  imports: [
    NestCacheModule.register<RedisClientOptions>({
      isGlobal: true,
      ttl: ClockUtil.getMilliseconds('10m'),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store: async () =>
        await redisStore({
          // Store-specific configuration:
          socket: {
            host: 'localhost',
            port: 6379,
          },
        }),
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
