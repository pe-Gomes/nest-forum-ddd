# Forum

This is a forum application built with NestJS and Express,
using Clean Architecture principles and DDD concepts.

## Installation

```bash
docker compose up -d
pnpm install
pnpm start:dev
```

## Tech Stack

- NestJS
- TypeScript
- PostgresSQL (Prisma)
- Redis (ioredis)
- Cloudflare R2 (AWS S3 SDK compatible)

## TODO:

- [ ] Add Prisma transactions support for complex operations.
- [ ] Handle deletions of attachments on storage infra.
