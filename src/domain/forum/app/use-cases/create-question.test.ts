import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryQuestionsRepository } from '@tests/in-memory-repository/questions'
import { CreateQuestionUseCase } from './create-question'
import { EntityID } from '@/core/entities/value-objects/entity-id'
import { InMemoryQuestionAttachmentRepository } from '@tests/in-memory-repository/question-attachment'

let questionRepository: InMemoryQuestionsRepository
let questionAttachmentRepo: InMemoryQuestionAttachmentRepository
let useCase: CreateQuestionUseCase

describe('Create Question Use Case', () => {
  beforeEach(() => {
    questionAttachmentRepo = new InMemoryQuestionAttachmentRepository()
    questionRepository = new InMemoryQuestionsRepository(questionAttachmentRepo)
    useCase = new CreateQuestionUseCase(questionRepository)
  })

  it('should create a question', async () => {
    const res = await useCase.execute({
      content: 'question content',
      title: 'some question title',
      authorId: 'authorId',
    })

    expect(res.isSuccess()).toBe(true)
    expect(res.value?.question.id).toBeDefined()
    expect(res.value?.question.content).toEqual('question content')
    expect(res.value?.question.slug.value).toEqual('some-question-title')
    expect(res.value?.question.authorId.toString()).toEqual('authorId')
    expect(res.value?.question.createdAt).toBeDefined()
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

    // Testing WatchedList
    expect(questionRepository.questions[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new EntityID('1') }),
      expect.objectContaining({ attachmentId: new EntityID('2') }),
    ])

    //Testing QuestionAttachments Repository
    expect(questionAttachmentRepo.questionAttachments).toHaveLength(2)
    expect(questionAttachmentRepo.questionAttachments).toEqual([
      expect.objectContaining({ attachmentId: new EntityID('1') }),
      expect.objectContaining({ attachmentId: new EntityID('2') }),
    ])
  })
})
