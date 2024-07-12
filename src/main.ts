import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';

import environment from '@/configs/environment';
import corsOptions from '@/configs/cors-options';
import swaggerSetup from '@/configs/swagger-setup';
import globalSetup from '@/configs/global-setup';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('NestApplication');

  app.enableCors(corsOptions);
  app.setGlobalPrefix('api');

  swaggerSetup(app);
  globalSetup(app);

  await app.listen(environment.PORT);

  logger.log(`Server running http://localhost:${environment.PORT}/api/health`);
}
bootstrap();
