import { Controller, Get } from '@nestjs/common';
import { ApiDocs } from '@/common/swagger/api-config.swagger';
import { HealthPresenter } from '@/modules/health/presenters/health.presenter';
import { Public } from '@/common/decorators/public.decorator';

@Controller('health')
export class HealthController {
  @Get()
  @Public()
  @ApiDocs({
    tags: 'health',
    isPublic: true,
    response: [{ status: 200, type: HealthPresenter }],
  })
  getVersionIphone(): HealthPresenter {
    return {
      message: 'Status: OK',
    };
  }
}
