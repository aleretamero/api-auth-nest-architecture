import { GlobalExceptionFilter } from '@/common/exception-filters/global-exception.filter';
import { INestApplication, ValidationPipe } from '@nestjs/common';

export default (app: INestApplication) => {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
};
