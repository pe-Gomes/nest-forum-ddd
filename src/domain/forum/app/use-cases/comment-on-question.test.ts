import { InMemoryQuestionCommentRepository } from '@tests/in-memory-repository/question-comment'
import { InMemoryQuestionsRepository } from '@tests/in-memory-repository/questions'
import { beforeEach, describe, expect, it } from 'vitest'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { createQuestion } from '@tests/factory/question'
import { InMemoryQuestionAttachmentRepository } from '@tests/in-memory-repository/question-attachment'
import { InMemoryStudentsRepository } from '@tests/in-memory-repository/student-repository'

let studentsRepo: InMemoryStudentsRepository
let questionCommentRepository: InMemoryQuestionCommentRepository
let questionAttachmentRepo: InMemoryQuestionAttachmentRepository
let questionRespository: InMemoryQuestionsRepository
let sut: CommentOnQuestionUseCase

describe('CommentOnQuestion Use Case', () => {
  beforeEach(() => {
    studentsRepo = new InMemoryStudentsRepository()
    questionAttachmentRepo = new InMemoryQuestionAttachmentRepository()
    questionCommentRepository = new InMemoryQuestionCommentRepository(
      studentsRepo,
    )
    questionRespository = new InMemoryQuestionsRepository(
      questionAttachmentRepo,
    )
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
