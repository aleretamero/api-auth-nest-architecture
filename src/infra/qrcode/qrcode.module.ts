import { Module } from '@nestjs/common';
import { QRCodeService } from '@/infra/qrcode/qrcode.service';

@Module({
  providers: [QRCodeService],
  exports: [QRCodeService],
})
export class QRCodeModule {}
