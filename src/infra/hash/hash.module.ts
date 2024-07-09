import { Module } from '@nestjs/common';
import { HashService } from '@/infra/hash/hash.service';

@Module({
  providers: [HashService],
  exports: [HashService],
})
export class HashModule {}
