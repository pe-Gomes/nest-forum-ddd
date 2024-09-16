import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/db/database.module'
import { JwtService } from '@nestjs/jwt/dist'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from '@tests/factory/question'
import { StudentFactory } from '@tests/factory/student'
import request from 'supertest'

describe('Upload Attachment (e2e)', async () => {
  let app: NestExpressApplication
  let studentFactory: StudentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
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
    expect(res.body).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      attachmentId: expect.any(String),
    })
  })
})
