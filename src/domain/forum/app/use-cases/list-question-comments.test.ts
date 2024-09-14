import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest'

import { EntityID } from '@/core/entities/value-objects/entity-id'
import { ListQuestionCommentsUseCase } from './list-question-comments'
import { InMemoryQuestionCommentRepository } from '@tests/in-memory-repository/question-comment'
import { createQuestionComment } from '@tests/factory/question-comment'

let questionCommentRepo: InMemoryQuestionCommentRepository
let sut: ListQuestionCommentsUseCase

describe('ListRecentAnswers', () => {
  beforeEach(() => {
    questionCommentRepo = new InMemoryQuestionCommentRepository()
    sut = new ListQuestionCommentsUseCase(questionCommentRepo)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should list recent comments by date', async () => {
    const questionId = new EntityID()

    vi.setSystemTime(new Date(2024, 0, 1, 12))
    await questionCommentRepo.create(createQuestionComment({ questionId }))

    vi.advanceTimersByTime(1000 * 60 * 60 * 24 * 2) // Add 2 days
    await questionCommentRepo.create(createQuestionComment({ questionId }))

    vi.advanceTimersByTime(1000 * 60 * 60 * 24 * 2) // Add 2 days
    await questionCommentRepo.create(createQuestionComment({ questionId }))

    const { value } = await sut.execute({
      questionId: questionId.toString(),
      page: 1,
      limit: 10,
    })

    expect(value?.comments).toHaveLength(3)
    expect(value?.comments[0].createdAt.getDay()).toBe(5)
    expect(value?.comments[1].createdAt.getDay()).toBe(3)
    expect(value?.comments[2].createdAt.getDay()).toBe(1)
  })

  it('should paginate question comments properly', async () => {
    const questionId = new EntityID()

    for (let i = 0; i < 15; i++) {
      await questionCommentRepo.create(createQuestionComment({ questionId }))
    }

    const { value } = await sut.execute({
      questionId: questionId.toString(),
      page: 2,
      limit: 10,
    })

    expect(value?.comments).toHaveLength(5)
  })
})
