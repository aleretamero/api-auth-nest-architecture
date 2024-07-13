import { Controller, Get } from '@nestjs/common';
import { LogErrorService } from './log-error.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/modules/user/enums/role.enum';

@Controller('log-errors')
@Roles(Role.ADMIN)
export class LogErrorController {
  constructor(private readonly logErrorService: LogErrorService) {}

  @Get()
  findAll() {
    return this.logErrorService.findAll();
  }
}
