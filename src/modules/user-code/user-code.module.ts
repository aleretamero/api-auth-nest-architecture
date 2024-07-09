import { Module } from '@nestjs/common';
import { TypeormModule } from '@/infra/database/postgres/typeorm-module';
import { UserCodeService } from '@/modules/user-code/user-code.service';

@Module({
  imports: [TypeormModule],
  providers: [UserCodeService],
  exports: [UserCodeService],
})
export class UserCodeModule {}
