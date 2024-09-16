import { Module } from '@nestjs/common';
import { TypeormModule } from '@/infra/database/postgres/typeorm-module';
import { TwoFactorAuthModule } from '@/infra/two-factor-auth/two-factor-auth.module';
import { User2FAService } from '@/modules/user/sub-modules/user-2fa/user-2fa.service';
import { EncryptModule } from '@/infra/encrypt/encrypt.module';
import { QRCodeModule } from '@/infra/qrcode/qrcode.module';

@Module({
  imports: [TypeormModule, TwoFactorAuthModule, EncryptModule, QRCodeModule],
  providers: [User2FAService],
  exports: [User2FAService],
})
export class User2FAModule {}
