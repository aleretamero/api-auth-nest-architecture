import { Module } from '@nestjs/common';
import { PersonalDataService } from '@/modules/user/sub-modules/personal-data/personal-data.service';
import { PersonalDataController } from '@/modules/user/sub-modules/personal-data/personal-data.controller';

@Module({
  controllers: [PersonalDataController],
  providers: [PersonalDataService],
})
export class PersonalDataModule {}
