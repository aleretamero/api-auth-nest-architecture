import * as path from 'node:path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'express-handlebars';

export default (app: NestExpressApplication) => {
  app.useStaticAssets(path.join(__dirname, '..', '..', 'public'));
  app.setBaseViewsDir(path.join(__dirname, '..', 'views'));

  app.engine(
    'hbs',
    hbs.engine({
      extname: 'hbs',
      defaultLayout: 'main',
      layoutsDir: path.join(__dirname, '..', 'views', 'layouts'),
      partialsDir: path.join(__dirname, '..', 'views', 'partials'),
    }),
  );

  app.setViewEngine('hbs');
};
