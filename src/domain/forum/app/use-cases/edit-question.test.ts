import { describe, it, beforeEach, expect } from 'vitest'
import { EditQuestionUseCase } from './edit-question'
import { InMemoryQuestionsRepository } from '@tests/in-memory-repository/questions'
import { EntityID } from '@/core/entities/value-objects/entity-id'
import { createQuestion } from '@tests/factory/question'
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'
import { InMemoryQuestionAttachmentRepository } from '@tests/in-memory-repository/question-attachment'
import { createQuestionAttachment } from '@tests/factory/question-attachment'

let questionRepository: InMemoryQuestionsRepository
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: EditQuestionUseCase

describe('EditQuestion Use Case', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionsRepository()
    questionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
    sut = new EditQuestionUseCase(
      questionRepository,
      questionAttachmentRepository,
    )
  })

  it('should edit a question an existing question', async () => {
    const question = createQuestion(
      {
        authorId: new EntityID('author-id'),
      },
      new EntityID('2'),
    )

    await questionRepository.create(question)
    questionAttachmentRepository.questionAttachments.push(
      createQuestionAttachment({
        questionId: question.id,
        attachmentId: new EntityID('1'),
      }),
      createQuestionAttachment({
        questionId: question.id,
        attachmentId: new EntityID('2'),
      }),
    )

    await sut.execute({
      title: '1',
      content: 'test',
      authorId: 'author-id',
      questionId: question.id.toString(),
      attachmentsIds: ['1', '3'],
    })

    expect(questionRepository.questions[0]).toMatchObject({
      title: '1',
      content: 'test',
    })
    expect(
      questionRepository.questions[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(questionRepository.questions[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new EntityID('1'),
      }),
      expect.objectContaining({
        attachmentId: new EntityID('3'),
      }),
    ])
    expect(
      questionRepository.questions[0].attachments.getRemovedItems(),
    ).toHaveLength(1)
  })

  it('should NOT edit a question of a different author', async () => {
    await questionRepository.create(createQuestion({}, new EntityID('2')))

    const res = await sut.execute({
      title: '1',
      content: 'test',
      authorId: 'wrong-author-id',
      questionId: '2',
    })

    expect(res.value).toBeInstanceOf(NotAllowedError)
  })

  it('should return an error if question not found', async () => {
    await questionRepository.create(createQuestion({}))
    const res = await sut.execute({
      title: '1',
      content: 'test',
      authorId: 'wrong-author-id',
      questionId: 'wrong-question-id',
    })

    expect(res.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
