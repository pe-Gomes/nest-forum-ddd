import { InMemoryQuestionsRepository } from '@tests/in-memory-repository/questions'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { createQuestion } from '@tests/factory/question'
import { ResourceNotFoundError } from '@/core/errors'
import { InMemoryQuestionAttachmentRepository } from '@tests/in-memory-repository/question-attachment'
import { InMemoryAttachmentsRepository } from '@tests/in-memory-repository/attachment'
import { InMemoryStudentsRepository } from '@tests/in-memory-repository/student-repository'
import { createStudent } from '@tests/factory/student'
import { createAttachment } from '@tests/factory/attachment'
import { createQuestionAttachment } from '@tests/factory/question-attachment'

let studentsRepo: InMemoryStudentsRepository
let attachmentsRepo: InMemoryAttachmentsRepository
let questionRepo: InMemoryQuestionsRepository
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question by Slug Use Case', () => {
  beforeEach(() => {
    studentsRepo = new InMemoryStudentsRepository()
    attachmentsRepo = new InMemoryAttachmentsRepository()
    questionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
    questionRepo = new InMemoryQuestionsRepository(
      attachmentsRepo,
      questionAttachmentRepository,
      studentsRepo,
    )
    sut = new GetQuestionBySlugUseCase(questionRepo)
  })

  it('it should get question by a slug if exists', async () => {
    const student = await createStudent()
    await studentsRepo.create(student)

    const question = createQuestion({ authorId: student.id })
    await questionRepo.create(question)

    const attachment = createAttachment({
      title: 'Some attachment',
    })

    await attachmentsRepo.create(attachment)

    await questionAttachmentRepository.createMany([
      createQuestionAttachment({
        attachmentId: attachment.id,
        questionId: question.id,
      }),
    ])

    const res = await sut.execute({ slug: question.slug.value })

    expect(res.isSuccess()).toBe(true)

    if (!res.isSuccess()) return

    expect(res.value).toMatchObject({
      question: {
        title: question.title,
        slug: question.slug,
        authorName: student.name,
        attachments: [
          expect.objectContaining({
            title: attachment.title,
          }),
        ],
      },
    })
  })

  it('it should return ResourceNotFoundError if question does not exists', async () => {
    const res = await sut.execute({ slug: 'invalid-slug' })
    expect(res.isFailure()).toBe(true)
    expect(res.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
