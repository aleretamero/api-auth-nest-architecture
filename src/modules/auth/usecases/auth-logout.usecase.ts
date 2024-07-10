import { Injectable } from '@nestjs/common';
import { SessionService } from '@/modules/user/sub-modules/session/session.service';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class AuthLogoutUsecase {
  constructor(private readonly sessionService: SessionService) {}

  async execute(deviceIdentifier: string, user: User): Promise<void> {
    await this.sessionService.remove(user, deviceIdentifier);
  }
}
