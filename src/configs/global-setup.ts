import { GlobalExceptionFilter } from '@/common/exception-filters/global-exception.filter';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

export default (app: INestApplication) => {
  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new I18nValidationExceptionFilter({ detailedErrors: false })); // prettier-ignore
  app.useGlobalFilters(new GlobalExceptionFilter());
};
