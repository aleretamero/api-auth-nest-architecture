import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  // General
  BASE_URL: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number(),

  // Docs
  SWAGGER_PREFIX: z.string().default('docs'),

  // Frontend
  FRONTEND_URL: z.string().url().optional(),

  // 2FA
  TWO_FACTOR_AUTH_ENCRYPTION_KEY: z.string(),

  // JWT
  JWT_SECRET: z.string(),

  // CORS
  CORS_WHITE_LIST: z
    .string()
    .transform((value) => value.split(/[,]/).filter(Boolean))
    .refine((array) => z.array(z.string().url()).safeParse(array).success)
    .optional(),

  // Postgres
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASS: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_SSL: z
    .enum(['require', 'disable'])
    .transform((value) => value === 'require')
    .optional(),

  // MongoDB
  MONGO_HOST: z.string().optional(),
  MONGO_PORT: z.coerce.number().optional(),
  MONGO_USER: z.string().optional(),
  MONGO_PASS: z.string().optional(),
  MONGO_DB: z.string(),
  MONGO_URI: z.string().url(),

  // Supabase
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE: z.string().optional(),

  // Mail
  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number(),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),

  // Cache
  CACHE_REDIS_HOST: z.string(),
  CACHE_REDIS_PORT: z.coerce.number(),

  // Queue
  QUEUE_REDIS_HOST: z.string(),
  QUEUE_REDIS_PORT: z.coerce.number(),

  // API Portfolio
  API_PORTFOLIO_URL: z.string().url().optional(),
  API_PORTFOLIO_TOKEN: z.string().optional(),
  API_PORTFOLIO_PROJECT_ID: z.string().optional(),
});

export default schema.parse(process.env);
