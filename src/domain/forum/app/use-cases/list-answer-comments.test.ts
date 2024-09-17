import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest'

import { EntityID } from '@/core/entities/value-objects/entity-id'
import { InMemoryAnswerCommentRepository } from '@tests/in-memory-repository/answer-comment'
import { ListAnswerCommentsUseCase } from './list-answer-comments'
import { createAnswerComment } from '@tests/factory/answer-comment'
import { InMemoryStudentsRepository } from '@tests/in-memory-repository/student-repository'
import { createStudent } from '@tests/factory/student'

let studentsRepo: InMemoryStudentsRepository
let questionCommentRepo: InMemoryAnswerCommentRepository
let sut: ListAnswerCommentsUseCase

describe('List Recent Answers Use Case', () => {
  beforeEach(() => {
    studentsRepo = new InMemoryStudentsRepository()
    questionCommentRepo = new InMemoryAnswerCommentRepository(studentsRepo)
    sut = new ListAnswerCommentsUseCase(questionCommentRepo)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should list recent comments by date', async () => {
    const answerId = new EntityID()
    const student = await createStudent()

    await studentsRepo.create(student)

    vi.setSystemTime(new Date(2024, 0, 1, 12))
    await questionCommentRepo.create(
      createAnswerComment({ answerId, authorId: student.id }),
    )

    vi.advanceTimersByTime(1000 * 60 * 60 * 24 * 2) // Add 2 days
    await questionCommentRepo.create(
      createAnswerComment({ answerId, authorId: student.id }),
    )

    vi.advanceTimersByTime(1000 * 60 * 60 * 24 * 2) // Add 2 days
    await questionCommentRepo.create(
      createAnswerComment({ answerId, authorId: student.id }),
    )

    const res = await sut.execute({
      answerId: answerId.toString(),
      page: 1,
      limit: 10,
    })

    expect(res.value?.comments).toHaveLength(3)
    expect(res.value?.comments).toEqual(
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
    expect(res.value?.comments[0].createdAt.getDay()).toBe(5)
    expect(res.value?.comments[1].createdAt.getDay()).toBe(3)
    expect(res.value?.comments[2].createdAt.getDay()).toBe(1)
  })

  it('should paginate question comments properly', async () => {
    const answerId = new EntityID()
    const student = await createStudent()

    await studentsRepo.create(student)

    for (let i = 0; i < 15; i++) {
      await questionCommentRepo.create(
        createAnswerComment({ answerId, authorId: student.id }),
      )
    }

    const res = await sut.execute({
      answerId: answerId.toString(),
      page: 2,
      limit: 10,
    })

    expect(res.value?.comments).toHaveLength(5)
  })
})
