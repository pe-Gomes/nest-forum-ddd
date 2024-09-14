import { InMemoryQuestionsRepository } from '@tests/in-memory-repository/questions'
import { waitFor } from '@tests/utils/wait-for'
import { describe, beforeEach, vi, it, expect } from 'vitest'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { OnAnswerCreated } from './on-answer-created'
import { InMemoryNotificationRepository } from '@tests/in-memory-repository/notification-repository'
import { InMemoryAnswerRepository } from '@tests/in-memory-repository/answer'
import { createAnswer } from '@tests/factory/answer'
import { createQuestion } from '@tests/factory/question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswerRepository
let inMemoryNotificationsRepository: InMemoryNotificationRepository
let sendNotificationUseCase: SendNotificationUseCase

let spySendNotification: unknown

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryAnswersRepository = new InMemoryAnswerRepository()
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
