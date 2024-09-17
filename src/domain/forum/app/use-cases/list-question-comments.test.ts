import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest'

import { EntityID } from '@/core/entities/value-objects/entity-id'
import { ListQuestionCommentsUseCase } from './list-question-comments'
import { InMemoryQuestionCommentRepository } from '@tests/in-memory-repository/question-comment'
import { createQuestionComment } from '@tests/factory/question-comment'
import { InMemoryStudentsRepository } from '@tests/in-memory-repository/student-repository'
import { createStudent } from '@tests/factory/student'

let studentsRepository: InMemoryStudentsRepository
let questionCommentRepo: InMemoryQuestionCommentRepository
let sut: ListQuestionCommentsUseCase

describe('ListRecentAnswers', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    questionCommentRepo = new InMemoryQuestionCommentRepository(
      studentsRepository,
    )
    sut = new ListQuestionCommentsUseCase(questionCommentRepo)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should list recent comments by date', async () => {
    const questionId = new EntityID()
    const student = await createStudent()

    await studentsRepository.create(student)

    vi.setSystemTime(new Date(2024, 0, 1, 12))
    await questionCommentRepo.create(
      createQuestionComment({ questionId, authorId: student.id }),
    )

    vi.advanceTimersByTime(1000 * 60 * 60 * 24 * 2) // Add 2 days
    await questionCommentRepo.create(
      createQuestionComment({ questionId, authorId: student.id }),
    )

    vi.advanceTimersByTime(1000 * 60 * 60 * 24 * 2) // Add 2 days
    await questionCommentRepo.create(
      createQuestionComment({ questionId, authorId: student.id }),
    )

    const { value } = await sut.execute({
      questionId: questionId.toString(),
      page: 1,
      limit: 10,
    })

    expect(value?.comments).toHaveLength(3)
    expect(value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authorName: student.name,
        }),
        expect.objectContaining({
          authorName: student.name,
        }),
        expect.objectContaining({
          authorName: student.name,
        }),
      ]),
    )
    expect(value?.comments[0].createdAt.getDay()).toBe(5)
    expect(value?.comments[1].createdAt.getDay()).toBe(3)
    expect(value?.comments[2].createdAt.getDay()).toBe(1)
  })

  it('should paginate question comments properly', async () => {
    const questionId = new EntityID()
    const student = await createStudent()

    studentsRepository.students.push(student)

    for (let i = 0; i < 15; i++) {
      await questionCommentRepo.create(
        createQuestionComment({ questionId, authorId: student.id }),
      )
    }

    const { value } = await sut.execute({
      questionId: questionId.toString(),
      page: 2,
      limit: 10,
    })

    expect(value?.comments).toHaveLength(5)
  })
})
