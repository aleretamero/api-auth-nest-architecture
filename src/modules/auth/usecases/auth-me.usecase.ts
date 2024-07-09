import { Injectable } from '@nestjs/common';
import { UserPresenter } from '@/modules/user/presenters/user.presenter';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class AuthMeUsecase {
  constructor(private readonly userPresenter: UserPresenter) {}

  async execute(user: User): Promise<UserPresenter> {
    return this.userPresenter.present(user);
  }
}
