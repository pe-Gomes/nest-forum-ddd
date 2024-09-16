import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/db/database.module'
import { JwtService } from '@nestjs/jwt/dist'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import { AnswerFactory } from '@tests/factory/answer'
import { AnswerCommentFactory } from '@tests/factory/answer-comment'
import { QuestionFactory } from '@tests/factory/question'
import { StudentFactory } from '@tests/factory/student'
import request from 'supertest'

describe('List Comments to Answer (e2e)', async () => {
  let app: NestExpressApplication
  let studentFactory: StudentFactory
  let questionsFactory: QuestionFactory
  let answersFactory: AnswerFactory
  let messageFactory: AnswerCommentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AnswerCommentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionsFactory = moduleRef.get(QuestionFactory)
    answersFactory = moduleRef.get(AnswerFactory)
    messageFactory = moduleRef.get(AnswerCommentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('[GET] /answers/:id/comments', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionsFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answersFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    await messageFactory.makePrismaComment({
      authorId: user.id,
      answerId: answer.id,
      content: 'Test 1',
    })
    await messageFactory.makePrismaComment({
      authorId: user.id,
      answerId: answer.id,
      content: 'Test 2',
    })

    const token = jwt.sign({ sub: user.id.toString() })

    const res = await request(app.getHttpServer())
      .get(`/answers/${answer.id.toString()}/comments`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      comments: [
        expect.objectContaining({ content: 'Test 2' }),
        expect.objectContaining({ content: 'Test 1' }),
      ],
    })
  })
})
