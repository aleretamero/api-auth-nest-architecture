import { Controller, Get } from '@nestjs/common';
import { ApiDocs } from '@/common/swagger/api-config.swagger';
import { IsPublic } from '@/common/decorators/is-public.decorator';
import { MessageDto } from '@/common/dtos/message.dto';

@Controller('health')
export class HealthController {
  @Get()
  @IsPublic()
  @ApiDocs({ tags: 'health', isPublic: true, deviceIdentifier: false })
  status(): MessageDto {
    return new MessageDto('Status: OK');
  }
}
