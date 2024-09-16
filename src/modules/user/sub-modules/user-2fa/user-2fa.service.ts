import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { Injectable } from '@nestjs/common';
import { User } from '@/modules/user/entities/user.entity';
import { TwoFactorAuthService } from '@/infra/two-factor-auth/two-factor-auth.service';
import { User2FADto } from '@/modules/user/sub-modules/user-2fa/dtos/user-2fa.dto';
import { ClockUtil } from '@/common/helpers/clock-util';
import { EncryptService } from '@/infra/encrypt/encrypt.service';
import environment from '@/configs/environment';
import { QRCodeService } from '@/infra/qrcode/qrcode.service';

@Injectable()
export class User2FAService {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly encryptService: EncryptService,
    private readonly qrCodeService: QRCodeService,
  ) {}

  async generateQrCode(user: User): Promise<string> {
    let user2FA = await this.typeormService.user2FA.findOne({
      where: { userId: user.id },
    });

    if (!user2FA) {
      user2FA = this.typeormService.user2FA.create({
        userId: user.id,
      });
    }

    if (user2FA?.isVerified) {
      throw new Error('2FA is already enabled');
    }

    const { secret, otpauthUrl } = await this.twoFactorAuthService.generateSecret(user.email); // prettier-ignore

    const encryptedSecret = await this.encryptService.encrypt(
      environment.TWO_FACTOR_AUTH_ENCRYPTION_KEY,
      secret,
    );

    user2FA = this.typeormService.user2FA.merge(user2FA!, {
      tempSecret: encryptedSecret,
      tempSecretExpiry: ClockUtil.getTimestampMilliseconds('5m'),
    });

    await this.typeormService.user2FA.save(user2FA);

    return await this.qrCodeService.generate(otpauthUrl);
  }

  async enable(user: User, code: string): Promise<User2FADto> {
    let user2FA = await this.typeormService.user2FA.findOne({
      where: { userId: user.id },
    });

    if (!user2FA || !user2FA.tempSecret) {
      throw new Error('2FA unsolicited for activation');
    }

    if (
      !user2FA.tempSecretExpiry ||
      ClockUtil.getTimestampMilliseconds() > user2FA.tempSecretExpiry
    ) {
      throw new Error('2FA activation code has expired');
    }

    if (user2FA.isVerified) {
      throw new Error('2FA is already enabled');
    }

    const decryptedSecret = await this.encryptService.decrypt(
      environment.TWO_FACTOR_AUTH_ENCRYPTION_KEY,
      user2FA.tempSecret,
    );

    const isValid = await this.twoFactorAuthService.verify(
      decryptedSecret,
      code,
    );

    if (!isValid) {
      throw new Error('Invalid code');
    }

    user2FA = this.typeormService.user2FA.merge(user2FA, {
      secret: user2FA.tempSecret,
      tempSecret: null,
      tempSecretExpiry: null,
      isEnabled: true,
      isVerified: true,
    });

    await this.typeormService.user2FA.save(user2FA);

    return new User2FADto(user2FA);
  }

  async verify(user: User, code: string): Promise<User2FADto> {
    const user2FA = await this.typeormService.user2FA.findOne({
      where: { userId: user.id },
    });

    if (!user2FA || !user2FA.isEnabled) {
      throw new Error('2FA is not enabled');
    }

    if (!user2FA.isVerified) {
      throw new Error('2FA is not verified');
    }

    if (!user2FA.secret) {
      throw new Error('Secret is not set');
    }

    const decryptedSecret = await this.encryptService.decrypt(
      environment.TWO_FACTOR_AUTH_ENCRYPTION_KEY,
      user2FA.secret,
    );

    const isValid = await this.twoFactorAuthService.verify(
      decryptedSecret,
      code,
    );

    if (!isValid) {
      throw new Error('Invalid code');
    }

    return new User2FADto(user2FA);
  }

  async disable(user: User): Promise<void> {
    const user2FA = await this.typeormService.user2FA.findOne({
      where: { userId: user.id },
    });

    if (!user2FA || !user2FA.isEnabled) {
      throw new Error('2FA is not enabled');
    }

    await this.typeormService.user2FA.update(user2FA.id, {
      isEnabled: false,
      isVerified: false,
      secret: null,
      tempSecret: null,
      tempSecretExpiry: null,
    });
  }
}
