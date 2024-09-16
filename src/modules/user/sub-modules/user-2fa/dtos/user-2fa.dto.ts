import { User2FA } from '@/modules/user/sub-modules/user-2fa/entities/user-2fa.entity';

export class User2FADto {
  id: string;
  isEnabled: boolean;
  isVerified: boolean;
  userId: string;

  constructor(data: User2FA) {
    this.id = data.id;
    this.isEnabled = data.isEnabled;
    this.isVerified = data.isVerified;
    this.userId = data.userId;
  }
}
