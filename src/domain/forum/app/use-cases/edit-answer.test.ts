import { describe, it, beforeEach, expect } from 'vitest'
import { EditAnswerUseCase } from './edit-answer'
import { InMemoryAnswerRepository } from '@tests/in-memory-repository/answer'
import { EntityID } from '@/core/entities/value-objects/entity-id'
import { createAnswer } from '@tests/factory/answer'
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'
import { InMemoryAnswerAttachmentRepository } from '@tests/in-memory-repository/answer-attachment'
import { createAnswerAttachment } from '@tests/factory/answer-attachment'

let answerRepository: InMemoryAnswerRepository
let answerAttachmentRepo: InMemoryAnswerAttachmentRepository
let sut: EditAnswerUseCase

describe('EditAnswer Use Case', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswerRepository()
    answerAttachmentRepo = new InMemoryAnswerAttachmentRepository()
    sut = new EditAnswerUseCase(answerRepository, answerAttachmentRepo)
  })

  it('should edit a answer an existing question', async () => {
    const answer = createAnswer({
      authorId: new EntityID('1'),
    })
    await answerRepository.create(answer)

    answerAttachmentRepo.answerAttachments.push(
      createAnswerAttachment({
        answerId: answer.id,
        attachmentId: new EntityID('1'),
      }),
      createAnswerAttachment({
        answerId: answer.id,
        attachmentId: new EntityID('2'),
      }),
    )

    await sut.execute({
      content: 'test',
      authorId: '1',
      answerId: answer.id.toString(),
      attachmentsIds: ['1', '3'],
    })

    expect(answerRepository.answers[0]).toMatchObject({
      content: 'test',
    })
    expect(answerRepository.answers[0].attachments.currentItems).toHaveLength(2)
    expect(answerRepository.answers[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new EntityID('1'),
      }),
      expect.objectContaining({
        attachmentId: new EntityID('3'),
      }),
    ])
    expect(
      answerRepository.answers[0].attachments.getRemovedItems(),
    ).toHaveLength(1)
  })

  it('should NOT edit a answer of a different author', async () => {
    await answerRepository.create(createAnswer({}, new EntityID('2')))

    const res = await sut.execute({
      content: 'test',
      authorId: 'wrong-author-id',
      answerId: '2',
    })

    expect(res.value).toBeInstanceOf(NotAllowedError)
  })

  it('should throw an error if answer not found', async () => {
    await answerRepository.create(createAnswer({}))
    const res = await sut.execute({
      content: 'test',
      authorId: 'wrong-author-id',
      answerId: 'wrong-question-id',
    })

    expect(res.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
