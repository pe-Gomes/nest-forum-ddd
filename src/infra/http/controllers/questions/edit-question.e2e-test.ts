import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/db/database.module'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from '@tests/factory/question'
import { StudentFactory } from '@tests/factory/student'
import request from 'supertest'

describe('Edit Question By Slug E2E', () => {
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

  test('[PUT] /questions/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Question 01',
      slug: new Slug('question-01'),
    })

    const res = await request(app.getHttpServer())
      .put(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Question Edited', content: 'Content edited' })

    expect(res.status).toBe(204)

    const updatedQuestion = await db.question.findUnique({
      where: { id: question.id.toString() },
    })

    expect(updatedQuestion?.title).toBe('Question Edited')
    expect(updatedQuestion?.content).toBe('Content edited')
  })
})
