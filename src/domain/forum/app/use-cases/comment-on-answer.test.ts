import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryAnswerCommentRepository } from '@tests/in-memory-repository/answer-comment'
import { InMemoryAnswerRepository } from '@tests/in-memory-repository/answer'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { createAnswer } from '@tests/factory/answer'
import { InMemoryAnswerAttachmentRepository } from '@tests/in-memory-repository/answer-attachment'
import { InMemoryStudentsRepository } from '@tests/in-memory-repository/student-repository'

let studentsRepo: InMemoryStudentsRepository
let answerAttachRepo: InMemoryAnswerAttachmentRepository
let answerCommentRepository: InMemoryAnswerCommentRepository
let answerRespository: InMemoryAnswerRepository
let sut: CommentOnAnswerUseCase

describe('CommentOnAnswer Use Case', () => {
  beforeEach(() => {
    studentsRepo = new InMemoryStudentsRepository()
    answerAttachRepo = new InMemoryAnswerAttachmentRepository()
    answerCommentRepository = new InMemoryAnswerCommentRepository(studentsRepo)
    answerRespository = new InMemoryAnswerRepository(answerAttachRepo)
    sut = new CommentOnAnswerUseCase(answerRespository, answerCommentRepository)
  })

  it('should be able to comment on a answer', async () => {
    const answer = createAnswer()

    await answerRespository.create(answer)

    const res = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'random-author-id',
      content: 'random-content',
    })

    expect(res.isSuccess()).toBe(true)

    if (res.isFailure()) {
      return
    }

    expect(res.value?.comment.content).toBe('random-content')
  })
})
