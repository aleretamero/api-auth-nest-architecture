import { Module } from '@nestjs/common';
import { TwoFactorAuthService } from '@/infra/two-factor-auth/two-factor-auth.service';

@Module({
  providers: [TwoFactorAuthService],
  exports: [TwoFactorAuthService],
})
export class TwoFactorAuthModule {}
