import { SendNotificationUseCase } from '../use-cases/send-notification'
import { createQuestion } from '@tests/factory/question'
import { waitFor } from 'test/utils/wait-for'
import { InMemoryAttachmentsRepository } from '@tests/in-memory-repository/attachment'
import { InMemoryStudentsRepository } from '@tests/in-memory-repository/student-repository'
import { InMemoryNotificationRepository } from '@tests/in-memory-repository/notification-repository'
import { InMemoryQuestionAttachmentRepository } from '@tests/in-memory-repository/question-attachment'
import { InMemoryQuestionsRepository } from '@tests/in-memory-repository/questions'
import { InMemoryAnswerAttachmentRepository } from '@tests/in-memory-repository/answer-attachment'
import { InMemoryAnswerRepository } from '@tests/in-memory-repository/answer'
import { OnSetQuestionBestAnswer } from './on-set-question-best-answer'
import { createAnswer } from '@tests/factory/answer'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswersRepository: InMemoryAnswerRepository
let inMemoryNotificationsRepository: InMemoryNotificationRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: unknown

describe('On Question Best Answer Chosen', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryAttachmentsRepository,
      inMemoryQuestionAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentRepository()
    inMemoryAnswersRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryNotificationsRepository = new InMemoryNotificationRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnSetQuestionBestAnswer(
      inMemoryAnswersRepository,
      sendNotificationUseCase,
    )
  })

  it('should send a notification when topic has new best answer chosen', async () => {
    const question = createQuestion()
    await inMemoryQuestionsRepository.create(question)

    const answer = createAnswer({ questionId: question.id })

    await inMemoryAnswersRepository.create(answer)

    question.bestAnswerId = answer.id

    await inMemoryQuestionsRepository.update(question)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
