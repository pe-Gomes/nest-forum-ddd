import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryAnswerCommentRepository } from '@tests/in-memory-repository/answer-comment'
import { InMemoryAnswerRepository } from '@tests/in-memory-repository/answer'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { createAnswer } from '@tests/factory/answer'

let answerCommentRepository: InMemoryAnswerCommentRepository
let answerRespository: InMemoryAnswerRepository
let sut: CommentOnAnswerUseCase

describe('CommentOnAnswer Use Case', () => {
  beforeEach(() => {
    answerCommentRepository = new InMemoryAnswerCommentRepository()
    answerRespository = new InMemoryAnswerRepository()
    sut = new CommentOnAnswerUseCase(answerRespository, answerCommentRepository)
  })

  it('should be able to comment on a answer', async () => {
    const answer = createAnswer()

    await answerRespository.create(answer)

    const { comment } = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'random-author-id',
      content: 'random-content',
    })

    expect(comment.id).toBeDefined()
    expect(comment.answerId).toBe(comment.answerId)
  })
})
