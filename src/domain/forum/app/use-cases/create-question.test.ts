import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryQuestionsRepository } from '@tests/in-memory-repository/questions'
import { CreateQuestionUseCase } from './create-question'
import { EntityID } from '@/core/entities/value-objects/entity-id'
import { InMemoryQuestionAttachmentRepository } from '@tests/in-memory-repository/question-attachment'
import { InMemoryAttachmentsRepository } from '@tests/in-memory-repository/attachment'
import { InMemoryStudentsRepository } from '@tests/in-memory-repository/student-repository'

let studentsRepo: InMemoryStudentsRepository
let attachmentRepo: InMemoryAttachmentsRepository
let questionRepository: InMemoryQuestionsRepository
let questionAttachmentRepo: InMemoryQuestionAttachmentRepository
let useCase: CreateQuestionUseCase

describe('Create Question Use Case', () => {
  beforeEach(() => {
    attachmentRepo = new InMemoryAttachmentsRepository()
    questionAttachmentRepo = new InMemoryQuestionAttachmentRepository()
    studentsRepo = new InMemoryStudentsRepository()
    questionRepository = new InMemoryQuestionsRepository(
      attachmentRepo,
      questionAttachmentRepo,
      studentsRepo,
    )
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
