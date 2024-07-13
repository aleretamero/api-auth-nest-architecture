import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '@/modules/user/enums/role.enum';
import { RolesGuard } from '@/common/guards/roles.guard';

export const ROLES_KEY = 'ROLES_KEY';

export function Roles(...roles: Role[]) {
  return applyDecorators(UseGuards(RolesGuard), SetMetadata(ROLES_KEY, roles));
}
