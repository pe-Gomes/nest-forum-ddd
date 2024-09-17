import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryAnswerCommentRepository } from '@tests/in-memory-repository/answer-comment'
import { createAnswerComment } from '@tests/factory/answer-comment'
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { InMemoryStudentsRepository } from '@tests/in-memory-repository/student-repository'

let studentsRepo: InMemoryStudentsRepository
let questionCommentRepo: InMemoryAnswerCommentRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Comments Use Case', () => {
  beforeEach(() => {
    studentsRepo = new InMemoryStudentsRepository()
    questionCommentRepo = new InMemoryAnswerCommentRepository(studentsRepo)
    sut = new DeleteAnswerCommentUseCase(questionCommentRepo)
  })

  it('should delete a comment from an existing question', async () => {
    const comment = createAnswerComment()

    await questionCommentRepo.create(comment)

    await sut.execute({
      commentId: comment.id.toString(),
      authorId: comment.authorId.toString(),
    })

    expect(questionCommentRepo.comments[0]).toBeUndefined()
  })

  it('should return an error if answer comment does not exist', async () => {
    const res = await sut.execute({
      commentId: 'non-existing-id',
      authorId: '1',
    })

    expect(res.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return an error if answer comment does not exist', async () => {
    const res = await sut.execute({
      commentId: 'non-existing-id',
      authorId: '1',
    })

    expect(res.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return an error if is not the author of the question comment', async () => {
    const comment = createAnswerComment()
    await questionCommentRepo.create(comment)

    const res = await sut.execute({
      commentId: comment.id.toString(),
      authorId: 'wrong-id',
    })
    expect(res.value).toBeInstanceOf(NotAllowedError)
  })
})
