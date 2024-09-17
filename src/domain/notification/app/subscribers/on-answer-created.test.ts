import { InMemoryQuestionsRepository } from '@tests/in-memory-repository/questions'
import { waitFor } from '@tests/utils/wait-for'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { OnAnswerCreated } from './on-answer-created'
import { InMemoryNotificationRepository } from '@tests/in-memory-repository/notification-repository'
import { InMemoryAnswerRepository } from '@tests/in-memory-repository/answer'
import { createAnswer } from '@tests/factory/answer'
import { createQuestion } from '@tests/factory/question'
import { InMemoryQuestionAttachmentRepository } from '@tests/in-memory-repository/question-attachment'
import { InMemoryAnswerAttachmentRepository } from '@tests/in-memory-repository/answer-attachment'
import { InMemoryAttachmentsRepository } from '@tests/in-memory-repository/attachment'
import { InMemoryStudentsRepository } from '@tests/in-memory-repository/student-repository'

let inMemoryAttachmentRepo: InMemoryAttachmentsRepository
let inMemoryStudentRepo: InMemoryStudentsRepository
let inMemoryAnswerAttachmentsRepo: InMemoryAnswerAttachmentRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepo: InMemoryQuestionAttachmentRepository
let inMemoryAnswersRepository: InMemoryAnswerRepository
let inMemoryNotificationsRepository: InMemoryNotificationRepository
let sendNotificationUseCase: SendNotificationUseCase

let spySendNotification: unknown

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryStudentRepo = new InMemoryStudentsRepository()
    inMemoryAttachmentRepo = new InMemoryAttachmentsRepository()
    inMemoryQuestionAttachmentsRepo = new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryAttachmentRepo,
      inMemoryQuestionAttachmentsRepo,
      inMemoryStudentRepo,
    )
    inMemoryAnswerAttachmentsRepo = new InMemoryAnswerAttachmentRepository()
    inMemoryAnswersRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentsRepo,
    )
    inMemoryNotificationsRepository = new InMemoryNotificationRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    spySendNotification = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase)
  })

  it('should  send a notification when an answer is created', async () => {
    const question = createQuestion()
    const answer = createAnswer({ questionId: question.id })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    await waitFor(() => {
      expect(spySendNotification).toHaveBeenCalled()
    })
  })
})
