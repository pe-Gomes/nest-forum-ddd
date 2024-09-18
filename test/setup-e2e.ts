import { DomainEvents } from '@/core/events/domain-events'
import { envSchema } from '@/infra/env'
import { PrismaClient } from '@prisma/client'
import Redis from 'ioredis'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

const env = envSchema.parse(process.env)

const db = new PrismaClient()
const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  db: env.REDIS_DB,
})

const schemaId = randomUUID()

beforeAll(async () => {
  const dbURL = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = dbURL

  execSync('pnpm prisma migrate deploy')

  DomainEvents.shouldRun = false
  await redis.flushdb()
})

afterAll(async () => {
  await db.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await db.$disconnect()
})

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    console.error('Failed to load environment variables')
    process.exit(1)
  }

  const url = new URL(env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}
