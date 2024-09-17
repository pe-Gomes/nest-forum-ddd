import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/db/database.module'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt/dist'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import { AttachmentFactory } from '@tests/factory/attachment'
import { QuestionFactory } from '@tests/factory/question'
import { StudentFactory } from '@tests/factory/student'
import request from 'supertest'

describe('Answer Question (e2e)', async () => {
  let app: NestExpressApplication
  let studentFactory: StudentFactory
  let questionsFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let db: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    db = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionsFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('[POST] /questions/:id/answers', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionsFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    const token = jwt.sign({ sub: user.id.toString() })

    const res = await request(app.getHttpServer())
      .post(`/questions/${question.id.toString()}/answers`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Random answer',
        attachmentsIds: [attachment1.id.toString(), attachment2.id.toString()],
      })

    expect(res.status).toBe(201)

    const answer = await db.answer.findFirst({
      where: { content: 'Random answer' },
    })

    expect(answer).toBeTruthy()

    const attachmentsOnDb = await db.attachment.findMany({
      where: { answerId: answer?.id.toString() },
    })

    expect(attachmentsOnDb).toHaveLength(2)
  })
})
