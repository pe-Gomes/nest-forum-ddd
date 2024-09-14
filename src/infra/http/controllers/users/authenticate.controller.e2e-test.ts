import { AppModule } from '../../app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { hashPassword } from '@/lib/utils/hash'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Authenticate (e2e)', async () => {
  let app: NestExpressApplication
  let db: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    db = moduleRef.get(PrismaService)

    await app.init()
  })

  it('[POST] /sessions', async () => {
    const user = await db.user.create({
      data: {
        name: 'Test',
        email: 'test@email.com',
        passwordHash: await hashPassword('123456'),
      },
    })

    const res = await request(app.getHttpServer()).post('/sessions').send({
      email: user.email,
      password: '123456',
    })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('access_token')
  })
})
