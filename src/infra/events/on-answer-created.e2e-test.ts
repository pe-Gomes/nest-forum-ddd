import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/db/database.module'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt/dist'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import { AttachmentFactory } from '@tests/factory/attachment'
import { QuestionFactory } from '@tests/factory/question'
import { StudentFactory } from '@tests/factory/student'
import { waitFor } from '@tests/utils/wait-for'
import request from 'supertest'

describe('On Answer Created Event (e2e)', async () => {
  let app: NestExpressApplication
  let studentFactory: StudentFactory
  let questionsFactory: QuestionFactory
  let db: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    db = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionsFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when answer is created', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionsFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const token = jwt.sign({ sub: user.id.toString() })

    await request(app.getHttpServer())
      .post(`/questions/${question.id.toString()}/answers`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Random answer',
      })

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    await waitFor(async () => {
      const notificationOnDb = await db.notification.findFirst({
        where: { userId: user.id.toString() },
      })

      expect(notificationOnDb).not.toBeNull()
    })
  })
})
