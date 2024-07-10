import { Module } from '@nestjs/common';
import { PersonalDataService } from '@/modules/user/sub-modules/personal-data/personal-data.service';
import { PersonalDataController } from '@/modules/user/sub-modules/personal-data/personal-data.controller';
import { PersonalDataPresenter } from '@/modules/user/sub-modules/personal-data/presenters/personal-data.presenter';

@Module({
  controllers: [PersonalDataController],
  providers: [PersonalDataService, PersonalDataPresenter],
})
export class PersonalDataModule {}
