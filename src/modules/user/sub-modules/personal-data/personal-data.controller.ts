import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PersonalDataService } from '@/modules/user/sub-modules/personal-data/personal-data.service';
import { CreatePersonalDataDto } from '@/modules/user/sub-modules/personal-data/dto/create-personal-data.dto';
import { UpdatePersonalDataDto } from '@/modules/user/sub-modules/personal-data/dto/update-personal-data.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ApiDocs } from '@/common/swagger/api-config.swagger';

@Controller('personal-data')
export class PersonalDataController {
  constructor(private readonly personalDataService: PersonalDataService) {}

  @Post()
  @ApiDocs({ tags: 'personal-data', response: [400, 401] })
  create(
    @CurrentUser('id') userId: string,
    @Body() createPersonalDatumDto: CreatePersonalDataDto,
  ) {
    return this.personalDataService.create(userId, createPersonalDatumDto);
  }

  @Get()
  @ApiDocs({ tags: 'personal-data', response: [401] })
  index() {
    return this.personalDataService.findAll();
  }

  @Get(':id')
  @ApiDocs({ tags: 'personal-data', response: [400, 401, 404] })
  show(@Param('id', ParseUUIDPipe) id: string) {
    return this.personalDataService.findOne(id);
  }

  @Patch()
  @ApiDocs({ tags: 'personal-data', response: [400, 401, 404] })
  update(
    @CurrentUser('id', ParseUUIDPipe) userId: string,
    @Body() updatePersonalDatumDto: UpdatePersonalDataDto,
  ) {
    return this.personalDataService.update(userId, updatePersonalDatumDto);
  }

  @Delete()
  @ApiDocs({ tags: 'personal-data', response: [400, 401, 404] })
  remove(@CurrentUser('id', ParseUUIDPipe) userId: string) {
    return this.personalDataService.remove(userId);
  }
}
