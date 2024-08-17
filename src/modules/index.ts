import { Type } from '@nestjs/common';
import { UserModule } from '@/modules/user/user.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { HealthModule } from '@/modules/health/health.module';

export default [AuthModule, UserModule, HealthModule] as Type[];
