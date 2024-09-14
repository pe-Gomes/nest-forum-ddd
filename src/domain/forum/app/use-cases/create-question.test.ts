import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryQuestionsRepository } from '@tests/in-memory-repository/questions'
import { CreateQuestionUseCase } from './create-question'
import { EntityID } from '@/core/entities/value-objects/entity-id'

let repository: InMemoryQuestionsRepository
let useCase: CreateQuestionUseCase

describe('Create Question Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryQuestionsRepository()
    useCase = new CreateQuestionUseCase(repository)
  })

  it('should create a question with attachments', async () => {
    const res = await useCase.execute({
      content: 'question content',
      title: 'some question title',
      authorId: 'authorId',
      attachmentsIds: ['1', '2'],
    })

    expect(res.isSuccess()).toBe(true)
    expect(res.value?.question.id).toBeDefined()
    expect(res.value?.question.content).toEqual('question content')
    expect(res.value?.question.slug.value).toEqual('some-question-title')
    expect(res.value?.question.authorId.toString()).toEqual('authorId')
    expect(res.value?.question.createdAt).toBeDefined()
    expect(res.value?.question.attachments.currentItems).toHaveLength(2)
    expect(res.value?.question.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new EntityID('1') }),
      expect.objectContaining({ attachmentId: new EntityID('2') }),
    ])
  })
})
