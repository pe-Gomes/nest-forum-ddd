import { InMemoryQuestionCommentRepository } from '@tests/in-memory-repository/question-comment'
import { InMemoryQuestionsRepository } from '@tests/in-memory-repository/questions'
import { beforeEach, describe, expect, it } from 'vitest'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { createQuestion } from '@tests/factory/question'

let questionCommentRepository: InMemoryQuestionCommentRepository
let questionRespository: InMemoryQuestionsRepository
let sut: CommentOnQuestionUseCase

describe('CommentOnQuestion Use Case', () => {
  beforeEach(() => {
    questionCommentRepository = new InMemoryQuestionCommentRepository()
    questionRespository = new InMemoryQuestionsRepository()
    sut = new CommentOnQuestionUseCase(
      questionRespository,
      questionCommentRepository,
    )
  })

  it('should be able to comment on a question', async () => {
    const question = createQuestion()

    await questionRespository.create(question)

    const { comment } = await sut.execute({
      questionId: question.id.toString(),
      authorId: 'random-author-id',
      content: 'random-content',
    })

    expect(comment.id).toBeDefined()
    expect(comment.questionId).toBe(comment.questionId)
  })
})
