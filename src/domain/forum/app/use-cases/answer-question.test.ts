import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryAnswerRepository } from '@tests/in-memory-repository/answer'
import { AnswerQuestionUseCase } from './answer-question'
import { EntityID } from '@/core/entities/value-objects/entity-id'

let repository: InMemoryAnswerRepository
let useCase: AnswerQuestionUseCase

describe('Answer Question Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryAnswerRepository()
    useCase = new AnswerQuestionUseCase(repository)
  })

  it('should create a answer', async () => {
    const res = await useCase.execute({
      content: 'answer content',
      instructorId: 'instructorId',
      questionId: 'questionId',
      attachmentsIds: ['1', '2'],
    })

    expect(res.value?.answer.id).toBeDefined()
    expect(res.value?.answer.content).toEqual('answer content')
    expect(res.value?.answer.authorId.toString()).toEqual('instructorId')
    expect(res.value?.answer.questionId.toString()).toEqual('questionId')
    expect(res.value?.answer.createdAt).toBeDefined()
    expect(res.value?.answer.attachments.currentItems).toHaveLength(2)
    expect(res.value?.answer.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new EntityID('1') }),
      expect.objectContaining({ attachmentId: new EntityID('2') }),
    ])

    expect(repository.answers[0].id).toBe(res.value?.answer.id)
  })
})
