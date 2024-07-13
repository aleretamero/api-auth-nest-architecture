import { Module } from '@nestjs/common';
import { SessionService } from '@/modules/user/sub-modules/session/session.service';
import { JwtModule } from '@/infra/jwt/jwt.module';
import { HashModule } from '@/infra/hash/hash.module';
import { TypeormModule } from '@/infra/database/postgres/typeorm-module';

@Module({
  imports: [TypeormModule, JwtModule, HashModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
