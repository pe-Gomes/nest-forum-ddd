import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/db/database.module'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import { AttachmentFactory } from '@tests/factory/attachment'
import { QuestionFactory } from '@tests/factory/question'
import { QuestionAttachmentFactory } from '@tests/factory/question-attachment'
import { StudentFactory } from '@tests/factory/student'
import request from 'supertest'

describe('Edit Question By ID (E2E)', () => {
  let app: NestExpressApplication
  let studentFactory: StudentFactory
  let db: PrismaService
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        QuestionAttachmentFactory,
        AttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    db = moduleRef.get(PrismaService)
    questionFactory = moduleRef.get(QuestionFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /questions/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Question 01',
      slug: new Slug('question-01'),
    })

    // Existing attachments
    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()
    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment1.id,
      questionId: question.id,
    })
    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment2.id,
      questionId: question.id,
    })

    // New attachments
    const attachment3 = await attachmentFactory.makePrismaAttachment()

    // Update question with new attachments, removing attachment2
    const finalAttachmentsIds = [
      attachment1.id.toString(),
      attachment3.id.toString(),
    ]

    const res = await request(app.getHttpServer())
      .put(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Question Edited',
        content: 'Content edited',
        attachmentsIds: finalAttachmentsIds,
      })

    expect(res.status).toBe(204)

    const updatedQuestion = await db.question.findUnique({
      where: { id: question.id.toString() },
    })

    expect(updatedQuestion?.title).toBe('Question Edited')
    expect(updatedQuestion?.content).toBe('Content edited')

    const attachmentsOnDb = await db.attachment.findMany({
      where: { questionId: question.id.toString() },
    })

    expect(attachmentsOnDb).toHaveLength(2)
    expect(attachmentsOnDb.map((a) => a.id)).toEqual(finalAttachmentsIds)

    const removedAttachment = await db.attachment.findUnique({
      where: { id: attachment2.id.toString() },
    })

    expect(removedAttachment).toBeNull()
  })
})
