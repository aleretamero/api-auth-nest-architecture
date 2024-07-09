import { Injectable } from '@nestjs/common';
import { SessionService } from '@/modules/session/session.service';
import { User } from '@/modules/user/entities/user.entity';
import { SessionPresenter } from '@/modules/session/presenters/session.presenter';

@Injectable()
export class AuthRefreshUsecase {
  constructor(private readonly sessionService: SessionService) {}

  async execute(
    deviceIdentifier: string,
    user: User,
  ): Promise<SessionPresenter> {
    return await this.sessionService.create(user, deviceIdentifier);
  }
}
