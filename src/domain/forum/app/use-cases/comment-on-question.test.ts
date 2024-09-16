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

    const res = await sut.execute({
      questionId: question.id.toString(),
      authorId: 'random-author-id',
      content: 'random-content',
    })

    if (res.isFailure()) {
      return
    }

    expect(res.value?.comment.id).toBeDefined()
    expect(res.value?.comment.questionId).toBe(res.value.comment.questionId)
  })
})
