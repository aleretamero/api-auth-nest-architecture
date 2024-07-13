import { INestApplication } from '@nestjs/common';
import environment from '@/configs/environment';

export default (app: INestApplication) =>
  app.enableCors({
    origin: (origin, callback) => {
      const whiteList =
        environment.CORS_WHITE_LIST?.map((url) =>
          url.endsWith('/') ? url.slice(0, -1) : url,
        ) ?? [];

      if ((origin && whiteList.includes(origin)) ?? !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Refresh-Token',
      'X-Device-Identifier',
    ],
  });
