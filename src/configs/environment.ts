import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('example'),
  DB_DATABASE: z.string().default('auth-nestjs'),
  DB_SSL: z
    .enum(['require', 'disable'])
    .default('disable')
    .transform((value) => value === 'require'),
  MONGO_URL: z.string().url().default('mongodb://root:example@localhost:27017'),
  JWT_SECRET: z.string().default('secret'),
  JWT_EXPIRES_IN: z.string().default('30m'),
  CLIENTS_URL: z
    .string()
    .transform((value) => value.split(/[,]/))
    .refine(
      (array) => z.array(z.string().url()).min(1).safeParse(array).success,
    )
    .default('http://localhost:3000,http://localhost:3333'),
  // SUPABASE_URL: z.string().url(),
  // SUPABASE_SERVICE_ROLE: z.string(),
  // EMAIL_SERVICE: z.string(),
  // EMAIL_USER: z.string(),
  // EMAIL_PASS: z.string(),
  // REDIS_HOST: z.string().default('localhost'),
  // REDIS_PORT: z.coerce.number().default(6379),
  // REDIS_PASSWORD: z.string().default('example'),
  // REDIS_DB: z.coerce.number().default(0),
});

export default schema.parse(process.env);
