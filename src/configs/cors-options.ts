import environments from '@/configs/environment';
import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';

export default {
  origin: (origin, callback) => {
    const whiteList = environments.CLIENTS_URL.map((url) =>
      url.endsWith('/') ? url.slice(0, -1) : url,
    );

    if ((origin && whiteList.includes(origin)) ?? !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
} as CorsOptions | CorsOptionsDelegate<any>;
