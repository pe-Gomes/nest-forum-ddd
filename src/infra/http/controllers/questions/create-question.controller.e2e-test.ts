import { AppModule } from '@/infra/http/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { hashPassword } from '@/lib/utils/hash'
import { JwtService } from '@nestjs/jwt/dist'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create question (e2e)', async () => {
  let app: NestExpressApplication
  let db: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    db = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('[POST] /questions', async () => {
    const user = await db.user.create({
      data: {
        name: 'Test',
        email: 'test@email.com',
        passwordHash: await hashPassword('123456'),
      },
    })

    const token = jwt.sign({ sub: user.id })

    const res = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test',
        content: 'Random content',
      })

    if (!res.ok) {
      console.error(res.body)
    }

    expect(res.status).toBe(201)

    const question = await db.question.findFirst({
      where: { title: 'Test' },
    })
    expect(question?.id).toBeTruthy()
  })
})
