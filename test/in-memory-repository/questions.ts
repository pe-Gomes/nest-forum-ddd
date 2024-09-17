import { type Question } from '@/domain/forum/enterprise/entities/question'
import { type QuestionsRepository } from '@/domain/forum/app/repositories/questions-repository'
import { type QuestionAttachmentsRepository } from '@/domain/forum/app/repositories/question-attachments-repository'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = []

  constructor(private questionAttachments: QuestionAttachmentsRepository) {}

  async create(question: Question) {
    this.questions.push(question)

    await this.questionAttachments.createMany(question.attachments.getItems())
  }

  async getBySlug(slug: string) {
    return await Promise.resolve(
      this.questions.find((question) => question.slug.value === slug) ?? null,
    )
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
