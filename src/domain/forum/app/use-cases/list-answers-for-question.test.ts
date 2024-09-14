import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest'

import { InMemoryAnswerRepository } from '@tests/in-memory-repository/answer'
import { ListAnswersForQuestionUseCase } from './list-answers-for-question'
import { InMemoryQuestionsRepository } from '@tests/in-memory-repository/questions'
import { EntityID } from '@/core/entities/value-objects/entity-id'

import { createAnswer } from '@tests/factory/answer'
import { createQuestion } from '@tests/factory/question'

let answerRepository: InMemoryAnswerRepository
let sut: ListAnswersForQuestionUseCase
let questionsRepository: InMemoryQuestionsRepository

describe('ListRecentAnswers', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswerRepository()
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new ListAnswersForQuestionUseCase(answerRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should list recent answers by date', async () => {
    const questionId = new EntityID('question')

    await questionsRepository.create(createQuestion({}, questionId))

    vi.setSystemTime(new Date(2024, 0, 1, 12))
    await answerRepository.create(createAnswer({ questionId }))

    vi.advanceTimersByTime(1000 * 60 * 60 * 24 * 2) // Add 2 days
    await answerRepository.create(createAnswer({ questionId }))

    vi.advanceTimersByTime(1000 * 60 * 60 * 24 * 2) // Add 2 days
    await answerRepository.create(createAnswer({ questionId }))

    const { value } = await sut.execute({
      questionId: questionId.toString(),
      page: 1,
      limit: 20,
    })

    expect(value?.answers).toHaveLength(3)
    expect(value?.answers[0].createdAt.getDay()).toBe(5)
    expect(value?.answers[1].createdAt.getDay()).toBe(3)
    expect(value?.answers[2].createdAt.getDay()).toBe(1)
  })

  it('should paginate answers properly', async () => {
    const questionId = new EntityID()

    for (let i = 0; i < 15; i++) {
      await answerRepository.create(createAnswer({ questionId }))
    }

    const { value } = await sut.execute({
      questionId: questionId.toString(),
      page: 2,
      limit: 10,
    })

    expect(value?.answers).toHaveLength(5)
  })
})
