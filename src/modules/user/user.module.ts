import { Module } from '@nestjs/common';
import { UserPresenter } from '@/modules/user/presenters/user.presenter';
import { UserCodeModule } from '@/modules/user/sub-modules/user-code/user-code.module';
import { SessionModule } from '@/modules/user/sub-modules/session/session.module';

@Module({
  imports: [SessionModule, UserCodeModule],
  providers: [UserPresenter],
  exports: [UserPresenter],
})
export class UserModule {}
