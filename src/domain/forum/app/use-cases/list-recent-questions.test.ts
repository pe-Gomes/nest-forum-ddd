import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest'

import { InMemoryQuestionsRepository } from '@tests/in-memory-repository/questions'
import { ListRecentQuestionsUseCase } from './list-recent-questions'
import { createQuestion } from '@tests/factory/question'
import { InMemoryQuestionAttachmentRepository } from '@tests/in-memory-repository/question-attachment'
import { InMemoryAttachmentsRepository } from '@tests/in-memory-repository/attachment'
import { InMemoryStudentsRepository } from '@tests/in-memory-repository/student-repository'

let studentRepo: InMemoryStudentsRepository
let attachmentsRepo: InMemoryAttachmentsRepository
let questionRepository: InMemoryQuestionsRepository
let questionAttachmentsRepo: InMemoryQuestionAttachmentRepository
let sut: ListRecentQuestionsUseCase

describe('ListRecentQuestions', () => {
  beforeEach(() => {
    studentRepo = new InMemoryStudentsRepository()
    attachmentsRepo = new InMemoryAttachmentsRepository()
    questionAttachmentsRepo = new InMemoryQuestionAttachmentRepository()
    questionRepository = new InMemoryQuestionsRepository(
      attachmentsRepo,
      questionAttachmentsRepo,
      studentRepo,
    )
    sut = new ListRecentQuestionsUseCase(questionRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should list recent questions by date', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 12))
    await questionRepository.create(createQuestion())

    vi.advanceTimersByTime(1000 * 60 * 60 * 24 * 2) // Add 2 days
    await questionRepository.create(createQuestion())

    vi.advanceTimersByTime(1000 * 60 * 60 * 24 * 2) // Add 2 days
    await questionRepository.create(createQuestion())

    const { value } = await sut.execute({ page: 1, limit: 20 })

    expect(value?.questions).toHaveLength(3)
    expect(value?.questions[0].createdAt.getDay()).toBe(5)
    expect(value?.questions[1].createdAt.getDay()).toBe(3)
    expect(value?.questions[2].createdAt.getDay()).toBe(1)
  })

  it('should paginate questions properly', async () => {
    for (let i = 0; i < 15; i++) {
      await questionRepository.create(createQuestion())
    }

    const { value } = await sut.execute({ page: 2, limit: 10 })

    expect(value?.questions).toHaveLength(5)
  })
})
