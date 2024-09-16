import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/db/database.module'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt/dist'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from '@tests/factory/question'
import { StudentFactory } from '@tests/factory/student'
import request from 'supertest'

describe('Answer Question (e2e)', async () => {
  let app: NestExpressApplication
  let studentFactory: StudentFactory
  let questionsFactory: QuestionFactory
  let db: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    db = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionsFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('[POST] /questions/:id/answers', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionsFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const token = jwt.sign({ sub: user.id.toString() })

    const res = await request(app.getHttpServer())
      .post(`/questions/${question.id.toString()}/answers`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Random answer',
      })

    console.log(res.body)

    expect(res.status).toBe(201)

    const answer = await db.answer.findFirst({
      where: { content: 'Random answer' },
    })

    expect(answer).toBeTruthy()
  })
})
