import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().default(8080),
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  R2_ACCESS_KEY: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_BUCKET_NAME: z.string(),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PASSWORD: z.string(),
  REDIS_DB: z.coerce.number().default(0),
})

export type Env = z.infer<typeof envSchema>
