import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async execute<T>(
    key: string,
    callback: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const cachedValue = await this.cacheManager.get<T>(key);

    if (cachedValue) return cachedValue;

    const value = await callback();

    await this.cacheManager.set(key, value, ttl);

    return value;
  }
}
