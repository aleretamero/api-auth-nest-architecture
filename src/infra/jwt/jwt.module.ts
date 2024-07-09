import environments from '@/configs/environment';
import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService } from '@/infra/jwt/jwt.service';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      useFactory: () => ({
        secret: environments.JWT_SECRET,
      }),
    }),
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
