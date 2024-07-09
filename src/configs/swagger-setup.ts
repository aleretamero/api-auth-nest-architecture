import environment from '@/configs/environment';
import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default (app: INestApplication) => {
  const logger = new Logger('Swagger');

  const config = new DocumentBuilder()
    .setTitle('Title here')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const prefix = 'docs';
  const port = environment.PORT;

  SwaggerModule.setup(prefix, app, document);
  logger.log(`Swagger is running on http://localhost:${port}/${prefix}`);
};
