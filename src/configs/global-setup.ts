import { INestApplication, ValidationPipe } from '@nestjs/common';

export default (app: INestApplication) => {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
};
