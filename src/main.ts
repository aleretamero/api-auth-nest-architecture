import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '@/app.module';

import environment from '@/configs/environment';
import corsSetup from '@/configs/cors-options';
import swaggerSetup from '@/configs/swagger-setup';
import globalSetup from '@/configs/global-setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('BootstrapApplication');

  corsSetup(app);
  swaggerSetup(app);
  globalSetup(app);

  await app.listen(environment.PORT, () => {
    logger.verbose(
      `Server running http://localhost:${environment.PORT}/health`,
    );
  });
}
bootstrap();
