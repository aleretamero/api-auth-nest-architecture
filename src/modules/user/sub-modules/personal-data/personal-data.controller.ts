import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PersonalDataService } from '@/modules/user/sub-modules/personal-data/personal-data.service';
import { CreatePersonalDataDto } from '@/modules/user/sub-modules/personal-data/dto/create-personal-data.dto';
import { UpdatePersonalDataDto } from '@/modules/user/sub-modules/personal-data/dto/update-personal-data.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('personal-data')
export class PersonalDataController {
  constructor(private readonly personalDataService: PersonalDataService) {}

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() createPersonalDatumDto: CreatePersonalDataDto,
  ) {
    return this.personalDataService.create(userId, createPersonalDatumDto);
  }

  @Get()
  index() {
    return this.personalDataService.findAll();
  }

  @Get(':id')
  show(@Param('id') id: string) {
    return this.personalDataService.findOne(id);
  }

  @Patch()
  update(
    @CurrentUser('id') userId: string,
    @Body() updatePersonalDatumDto: UpdatePersonalDataDto,
  ) {
    return this.personalDataService.update(userId, updatePersonalDatumDto);
  }

  @Delete()
  remove(@CurrentUser('id') userId: string) {
    return this.personalDataService.remove(userId);
  }
}
