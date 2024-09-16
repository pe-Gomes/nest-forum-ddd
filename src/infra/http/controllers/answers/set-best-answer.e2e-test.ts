import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/db/database.module'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt/dist'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import { AnswerFactory } from '@tests/factory/answer'
import { QuestionFactory } from '@tests/factory/question'
import { StudentFactory } from '@tests/factory/student'
import request from 'supertest'

describe('Set Best Answer to Question (e2e)', async () => {
  let app: NestExpressApplication
  let studentFactory: StudentFactory
  let questionsFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let db: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    db = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionsFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('[PATCH] /answers/:id/best-answer', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionsFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    })

    const token = jwt.sign({ sub: user.id.toString() })

    const res = await request(app.getHttpServer())
      .patch(`/answers/${answer.id.toString()}/best-answer`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(204)

    const editedQuestion = await db.question.findFirst({
      where: { id: question.id.toString() },
    })

    expect(editedQuestion?.bestAnswerId).toBe(answer.id.toString())
  })
})
