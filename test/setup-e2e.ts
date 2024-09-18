import { DomainEvents } from '@/core/events/domain-events'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

const DATABASE_URL = process.env.DATABASE_URL

const db = new PrismaClient()

const schemaId = randomUUID()

beforeAll(async () => {
  const dbURL = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = dbURL

  execSync('pnpm prisma migrate deploy')

  DomainEvents.shouldRun = false
})

afterAll(async () => {
  await db.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await db.$disconnect()
})

function generateUniqueDatabaseURL(schemaId: string) {
  if (!DATABASE_URL) {
    console.error('Failed to load environment variables')
    process.exit(1)
  }

  const url = new URL(DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}
