import { AppModule } from '../../app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create account (e2e)', async () => {
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

  it('should create a new account', async () => {
    const res = await request(app.getHttpServer()).post('/accounts').send({
      name: 'Test',
      email: 'test@email.com',
      password: '123456',
    })

    expect(res.status).toBe(201)

    const user = await db.user.findUnique({
      where: { email: 'test@email.com' },
    })
    expect(user?.id).toBeTruthy()
  })
})
