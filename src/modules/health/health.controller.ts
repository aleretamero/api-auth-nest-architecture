import { Controller, Get } from '@nestjs/common';
import { ApiDocs } from '@/common/swagger/api-config.swagger';

import { IsPublic } from '@/common/decorators/public.decorator';
import { HealthDto } from '@/modules/health/dtos/health.dto';

@Controller('health')
export class HealthController {
  @Get()
  @IsPublic()
  @ApiDocs({ tags: 'health', isPublic: true })
  getVersionIphone(): HealthDto {
    return new HealthDto('Status: OK');
  }
}
