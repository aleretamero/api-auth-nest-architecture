import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number(),
  FRONTEND_URL: z.string().url().optional(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASS: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_SSL: z
    .enum(['require', 'disable'])
    .transform((value) => value === 'require')
    .optional(),
  MONGO_HOST: z.string().optional(),
  MONGO_PORT: z.coerce.number().optional(),
  MONGO_USER: z.string().optional(),
  MONGO_PASS: z.string().optional(),
  MONGO_DB: z.string(),
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string(),
  CLIENTS_URL: z
    .string()
    .transform((value) => value.split(/[,]/).filter(Boolean))
    .refine((array) => z.array(z.string().url()).safeParse(array).success)
    .optional()
    .default(','),
  // SUPABASE_URL: z.string().url(),
  // SUPABASE_SERVICE_ROLE: z.string(),
  // MAIL_SERVICE: z.string(),
  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number(),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
  CACHE_REDIS_HOST: z.string(),
  CACHE_REDIS_PORT: z.coerce.number(),
  QUEUE_REDIS_HOST: z.string(),
  QUEUE_REDIS_PORT: z.coerce.number(),
});

export default schema.parse(process.env);
