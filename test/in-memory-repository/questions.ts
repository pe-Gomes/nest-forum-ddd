import { type Question } from '@/domain/forum/enterprise/entities/question'
import { type QuestionsRepository } from '@/domain/forum/app/repositories/questions-repository'
import { type InMemoryStudentsRepository } from './student-repository'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { type InMemoryQuestionAttachmentRepository } from './question-attachment'
import { type InMemoryAttachmentsRepository } from './attachment'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = []

  constructor(
    private attachmentsRepo: InMemoryAttachmentsRepository,
    private questionAttachments: InMemoryQuestionAttachmentRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(question: Question) {
    this.questions.push(question)

    await this.questionAttachments.createMany(question.attachments.getItems())
  }

  async getBySlug(slug: string) {
    return await Promise.resolve(
      this.questions.find((question) => question.slug.value === slug) ?? null,
    )
  }

  async getBySlugWithDetails(slug: string) {
    const question = this.questions.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    const author = this.studentsRepository.students.find((student) => {
      return student.id.equals(question.authorId)
    })

    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toString()}" does not exist.`,
      )
    }

    const questionAttachments =
      this.questionAttachments.questionAttachments.filter(
        (questionAttachment) => {
          return questionAttachment.questionId.equals(question.id)
        },
      )

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepo.items.find((attachment) => {
        return attachment.id.equals(questionAttachment.attachmentId)
      })

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exist.`,
        )
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      authorName: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }

  async getById(id: string) {
    return await Promise.resolve(
      this.questions.find((question) => question.id.toString() === id) ?? null,
    )
  }

  async getMany({ page, limit }: { page: number; limit: number }) {
    return await Promise.resolve(
      this.questions
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice((page - 1) * limit, page * limit),
    )
  }

  async update(question: Question) {
    const questionIdx = this.questions.findIndex(
      (q) => q.id.toString() === question.id.toString(),
    )

    this.questions[questionIdx] = question

    await this.questionAttachments.createMany(question.attachments.getItems())
    await this.questionAttachments.deleteMany(
      question.attachments.getRemovedItems(),
    )
  }

  async delete(id: string) {
    const questionIdx = this.questions.findIndex(
      (question) => question.id.toString() === id,
    )

    this.questions.splice(questionIdx, 1)
  }
}
