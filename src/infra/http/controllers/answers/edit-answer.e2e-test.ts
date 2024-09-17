import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/db/database.module'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt/dist'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import { AnswerFactory } from '@tests/factory/answer'
import { AnswerAttachmentFactory } from '@tests/factory/answer-attachment'
import { AttachmentFactory } from '@tests/factory/attachment'
import { QuestionFactory } from '@tests/factory/question'
import { StudentFactory } from '@tests/factory/student'
import request from 'supertest'

describe('Edit Answer to Question (e2e)', async () => {
  let app: NestExpressApplication
  let studentFactory: StudentFactory
  let questionsFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let attachmentFactory: AttachmentFactory
  let answerAttachmentFactory: AnswerAttachmentFactory
  let db: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AttachmentFactory,
        AnswerAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    db = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionsFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('[PUT] /answers/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionsFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    })

    // Setup initial attachments
    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    await answerAttachmentFactory.makeAnswerAttachment({
      attachmentId: attachment1.id,
      answerId: answer.id,
    })
    await answerAttachmentFactory.makeAnswerAttachment({
      attachmentId: attachment2.id,
      answerId: answer.id,
    })

    // New Attachments
    const attachment3 = await attachmentFactory.makePrismaAttachment()

    // All attachments to be edited, removeing attachment1
    const newAttachments = [
      attachment2.id.toString(),
      attachment3.id.toString(),
    ]

    const token = jwt.sign({ sub: user.id.toString() })

    const res = await request(app.getHttpServer())
      .put(`/answers/${answer.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Random answer edited',
        attachmentsIds: newAttachments,
      })

    expect(res.status).toBe(204)

    const editedAnswer = await db.answer.findFirst({
      where: { id: answer.id.toString() },
    })

    expect(editedAnswer).toBeTruthy()

    const attachmentsOnDB = await db.attachment.findMany({
      where: { answerId: answer.id.toString() },
    })

    expect(attachmentsOnDB).toHaveLength(2)

    const deletedAttachment = await db.attachment.findFirst({
      where: { id: attachment1.id.toString() },
    })

    expect(deletedAttachment).toBeNull()
  })
})
