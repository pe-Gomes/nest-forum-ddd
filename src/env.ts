import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().default(8080),
  DATABASE_URL: z.string().url(),
})

export type Env = z.infer<typeof envSchema>
