import { Module } from '@nestjs/common';
import { TypeormModule } from '@/infra/database/postgres/typeorm-module';
import { UserCodeService } from '@/modules/user/sub-modules/user-code/user-code.service';
import { HashModule } from '@/infra/hash/hash.module';

@Module({
  imports: [TypeormModule, HashModule],
  providers: [UserCodeService],
  exports: [UserCodeService],
})
export class UserCodeModule {}
