import { Controller, Get, Query } from '@nestjs/common';
import { LogErrorService } from './log-error.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/modules/user/enums/role.enum';
import { ApiExcludeController } from '@nestjs/swagger';
import { GetErrosLogQuery } from './queries/get-errors-log.query';

@ApiExcludeController()
@Controller('log-errors')
@Roles(Role.ADMIN)
export class LogErrorController {
  constructor(private readonly logErrorService: LogErrorService) {}

  @Get()
  findAll(@Query() getErrosLogQuery: GetErrosLogQuery) {
    return this.logErrorService.findAll(getErrosLogQuery);
  }
}
