import { Controller, Get } from '@nestjs/common';
import { ApiResponse as SaggerApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@/common/swagger/api-config.swagger';
import { HealthPresenter } from '@/modules/health/presenters/health.presenter';
import { Public } from '@/common/decorators/public.decorator';

@Controller('health')
@ApiTags('health')
export class HealthController {
  @Get()
  @SaggerApiResponse({ status: 200, type: HealthPresenter })
  @ApiResponse()
  @Public()
  getVersionIphone(): HealthPresenter {
    return {
      message: 'Status: OK',
    };
  }
}
