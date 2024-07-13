import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PersonalDataService } from '@/modules/user/sub-modules/personal-data/personal-data.service';
import { CreatePersonalDataDto } from '@/modules/user/sub-modules/personal-data/dto/create-personal-data.dto';
import { UpdatePersonalDataDto } from '@/modules/user/sub-modules/personal-data/dto/update-personal-data.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ApiDocs } from '@/common/swagger/api-config.swagger';

@Controller('users/me/personal-data')
export class PersonalDataController {
  constructor(private readonly personalDataService: PersonalDataService) {}

  @Post()
  @ApiDocs({ tags: 'personal-data', response: [400, 401] })
  create(
    @CurrentUser('id', ParseUUIDPipe) userId: string,
    @Body() createPersonalDataDto: CreatePersonalDataDto,
  ) {
    return this.personalDataService.create(userId, createPersonalDataDto);
  }

  @Patch()
  @ApiDocs({ tags: 'personal-data', response: [400, 401, 404] })
  update(
    @CurrentUser('id', ParseUUIDPipe) userId: string,
    @Body() updatePersonalDataDto: UpdatePersonalDataDto,
  ) {
    return this.personalDataService.update(userId, updatePersonalDataDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDocs({ tags: 'personal-data', response: [400, 401, 404] })
  remove(@CurrentUser('id', ParseUUIDPipe) userId: string) {
    return this.personalDataService.remove(userId);
  }
}
