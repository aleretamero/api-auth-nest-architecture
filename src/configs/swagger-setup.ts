import environment from '@/configs/environment';
import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default (app: INestApplication) => {
  if (environment.NODE_ENV !== 'development') return;

  const logger = new Logger('Swagger');

  const config = new DocumentBuilder()
    .setTitle('Title here')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const prefix = environment.SWAGGER_PREFIX;
  const port = environment.PORT;

  SwaggerModule.setup(prefix, app, document);
  logger.verbose(`Swagger is running on http://localhost:${port}/${prefix}`);
};
