import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/db/database.module'
import { JwtService } from '@nestjs/jwt'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from '@tests/factory/question'
import { StudentFactory } from '@tests/factory/student'
import request from 'supertest'

describe('Get Recent Questions By Slug E2E', () => {
  let app: NestExpressApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Question 1',
    })
    await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Question 2',
    })

    const res = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Question 2' }),
        expect.objectContaining({ title: 'Question 1' }),
      ],
    })
  })
})
