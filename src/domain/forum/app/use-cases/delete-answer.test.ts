import { describe, it, beforeEach, expect } from 'vitest'
import { DeleteAnswerUseCase } from './delete-answer'
import { InMemoryAnswerRepository } from '@tests/in-memory-repository/answer'
import { EntityID } from '@/core/entities/value-objects/entity-id'
import { type AnswersRepository } from '../repositories/answers-repository'
import { createAnswer } from '@tests/factory/answer'
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'
import { InMemoryAnswerAttachmentRepository } from '@tests/in-memory-repository/answer-attachment'
import { createAnswerAttachment } from '@tests/factory/answer-attachment'

let answerRepository: AnswersRepository
let answerAttachmentRepo: InMemoryAnswerAttachmentRepository
let sut: DeleteAnswerUseCase

describe('DeleteAnswer Use Case', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswerRepository()
    answerAttachmentRepo = new InMemoryAnswerAttachmentRepository()
    sut = new DeleteAnswerUseCase(answerRepository, answerAttachmentRepo)
  })

  it('should delete a question an existing question', async () => {
    const answer = createAnswer({
      authorId: new EntityID('2'),
    })

    await answerRepository.create(answer)
    answerAttachmentRepo.answerAttachments.push(
      createAnswerAttachment({ answerId: answer.id }),
      createAnswerAttachment({ answerId: answer.id }),
    )

    await sut.execute({ id: answer.id.toString(), authorId: '2' })

    const shouldBeNull = await answerRepository.getById(answer.id.toString())

    expect(shouldBeNull).toBeNull()
    expect(answerAttachmentRepo.answerAttachments).toHaveLength(0)
  })

  it('should throw an error if question does not exist', async () => {
    const res = await sut.execute({ id: 'non-existing-id', authorId: '1' })

    expect(res.isSuccess()).toBe(false)
    expect(res.isFailure()).toBe(true)
    expect(res.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should throw an error if author is not the author of the question', async () => {
    await answerRepository.create(
      createAnswer(
        {
          authorId: new EntityID('1'),
        },
        new EntityID('1'),
      ),
    )

    const res = await sut.execute({ id: '1', authorId: '3333' })

    expect(res.isFailure()).toBe(true)
    expect(res.value).toBeInstanceOf(NotAllowedError)
  })
})
