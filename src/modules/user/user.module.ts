import { Module } from '@nestjs/common';
import { UserPresenter } from '@/modules/user/presenters/user.presenter';

@Module({
  providers: [UserPresenter],
  exports: [UserPresenter],
})
export class UserModule {}
