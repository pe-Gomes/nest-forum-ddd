import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/db/database.module'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt/dist'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from '@tests/factory/question'
import { StudentFactory } from '@tests/factory/student'
import request from 'supertest'

describe('Upload Attachment (e2e)', async () => {
  let app: NestExpressApplication
  let studentFactory: StudentFactory
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
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('[POST] /attachments', async () => {
    const user = await studentFactory.makePrismaStudent()

    const token = jwt.sign({ sub: user.id.toString() })

    const res = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', './test/e2e/upload-sample.webp')

    expect(res.status).toBe(201)

    // const answer = await db.answer.findFirst({
    //   where: { content: 'Random answer' },
    // })
    //
    // expect(answer).toBeTruthy()
  })
})
