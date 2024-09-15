import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';

type GenerateSecretOutput = {
  secret: string;
  otpauthUrl: string;
};

@Injectable()
export class TwoFactorAuthService {
  private readonly TWO_FACTOR_AUTH_APP_NAME = 'YourAppName';

  async generateSecret(label: string): Promise<GenerateSecretOutput> {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      label,
      this.TWO_FACTOR_AUTH_APP_NAME,
      secret,
    );

    return {
      secret,
      otpauthUrl,
    };
  }

  async verify(secret: string, code: string): Promise<boolean> {
    return authenticator.verify({ secret, token: code });
  }
}
