import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/db/database.module'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt/dist'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import { AnswerFactory } from '@tests/factory/answer'
import { QuestionFactory } from '@tests/factory/question'
import { StudentFactory } from '@tests/factory/student'
import { waitFor } from '@tests/utils/wait-for'
import request from 'supertest'

describe('On Set Best Answer to Question Event (e2e)', async () => {
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

  it('should create a notification when the best answer is set', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionsFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    })

    const token = jwt.sign({ sub: user.id.toString() })

    await request(app.getHttpServer())
      .patch(`/answers/${answer.id.toString()}/best-answer`)
      .set('Authorization', `Bearer ${token}`)

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    await waitFor(async () => {
      const notificationOnDb = await db.notification.findFirst({
        where: { userId: user.id.toString() },
      })

      expect(notificationOnDb).not.toBeNull()
    })
  })
})
