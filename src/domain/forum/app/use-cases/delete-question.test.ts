import { describe, it, beforeEach, expect } from 'vitest'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { DeleteQuestionUseCase } from './delete-question'
import { InMemoryQuestionsRepository } from '@tests/in-memory-repository/questions'
import { createQuestion } from '@tests/factory/question'
import { EntityID } from '@/core/entities/value-objects/entity-id'
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'
import { InMemoryQuestionAttachmentRepository } from '@tests/in-memory-repository/question-attachment'
import { createQuestionAttachment } from '@tests/factory/question-attachment'

let questionRepository: QuestionsRepository
let questionAttachments: InMemoryQuestionAttachmentRepository
let sut: DeleteQuestionUseCase

describe('DeleteQuestion Use Case', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionsRepository()
    questionAttachments = new InMemoryQuestionAttachmentRepository()
    sut = new DeleteQuestionUseCase(questionRepository, questionAttachments)
  })

  it('should delete a question an existing question', async () => {
    const question = createQuestion({
      authorId: new EntityID('author-id'),
    })

    await questionRepository.create(question)
    questionAttachments.questionAttachments.push(
      createQuestionAttachment({
        questionId: question.id,
        attachmentId: new EntityID('1'),
      }),
      createQuestionAttachment({
        questionId: question.id,
        attachmentId: new EntityID('2'),
      }),
    )

    await sut.execute({ id: question.id.toString(), authorId: 'author-id' })

    const shouldBeNull = await questionRepository.getById('1')

    expect(shouldBeNull).toBeNull()
    expect(questionAttachments.questionAttachments).toHaveLength(0)
  })

  it('should throw an error if question does not exist', async () => {
    const res = await sut.execute({ id: 'non-existing-id', authorId: '1' })

    expect(res.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should throw an error if author is not the author of the question', async () => {
    await questionRepository.create(
      createQuestion(
        {
          authorId: new EntityID('1'),
        },
        new EntityID('1'),
      ),
    )

    const res = await sut.execute({ id: '1', authorId: 'wrong-id' })

    expect(res.value).toBeInstanceOf(NotAllowedError)
  })
})
