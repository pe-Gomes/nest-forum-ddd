import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/db/database.module'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt/dist'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from '@tests/factory/question'
import { QuestionCommentFactory } from '@tests/factory/question-comment'
import { StudentFactory } from '@tests/factory/student'
import request from 'supertest'

describe('Delete Comment to Question (e2e)', async () => {
  let app: NestExpressApplication
  let studentFactory: StudentFactory
  let questionsFactory: QuestionFactory
  let messageFactory: QuestionCommentFactory
  let db: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionsFactory = moduleRef.get(QuestionFactory)
    messageFactory = moduleRef.get(QuestionCommentFactory)
    db = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('[DELETE] /answers/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionsFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const comment = await messageFactory.makePrismaComment({
      questionId: question.id,
      authorId: user.id,
    })

    const token = jwt.sign({ sub: user.id.toString() })

    const res = await request(app.getHttpServer())
      .delete(`/comments/${comment.id.toString()}/question`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(204)

    const deleted = await db.comment.findFirst({
      where: { id: comment.id.toString() },
    })

    expect(deleted).toBeNull()
  })
})
