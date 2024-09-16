import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/db/database.module'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from '@tests/factory/question'
import { StudentFactory } from '@tests/factory/student'
import request from 'supertest'

describe('Delete Question By Slug E2E', () => {
  let app: NestExpressApplication
  let studentFactory: StudentFactory
  let db: PrismaService
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    db = moduleRef.get(PrismaService)
    questionFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /questions/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const res = await request(app.getHttpServer())
      .delete(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(res.status).toBe(204)

    const deletedQuestion = await db.question.findUnique({
      where: { id: question.id.toString() },
    })

    expect(deletedQuestion).toBeNull()
  })
})
