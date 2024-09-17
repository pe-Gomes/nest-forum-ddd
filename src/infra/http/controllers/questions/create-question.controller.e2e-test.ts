import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/db/database.module'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { hashPassword } from '@/lib/utils/hash'
import { JwtService } from '@nestjs/jwt/dist'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import { AttachmentFactory } from '@tests/factory/attachment'
import request from 'supertest'

describe('Create question (e2e)', async () => {
  let app: NestExpressApplication
  let db: PrismaService
  let jwt: JwtService
  let attachmentFactory: AttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    db = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    attachmentFactory = moduleRef.get(AttachmentFactory)

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

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    const token = jwt.sign({ sub: user.id })

    const res = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test',
        content: 'Random content',
        attachmentsIds: [attachment1.id.toString(), attachment2.id.toString()],
      })

    if (!res.ok) {
      console.error(res.body)
    }

    expect(res.status).toBe(201)

    const question = await db.question.findFirst({
      where: { title: 'Test' },
    })

    expect(question?.id).toBeTruthy()

    const attachmentsOnDb = await db.attachment.findMany({
      where: { questionId: question?.id.toString() },
    })

    expect(attachmentsOnDb).toHaveLength(2)
  })
})
