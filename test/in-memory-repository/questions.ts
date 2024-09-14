import { type Question } from '@/domain/forum/enterprise/entities/question'
import { type QuestionsRepository } from '@/domain/forum/app/repositories/questions-repository'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = []

  async create(question: Question) {
    await Promise.resolve(this.questions.push(question))
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
  }

  async delete(id: string) {
    const questionIdx = this.questions.findIndex(
      (question) => question.id.toString() === id,
    )
    await Promise.resolve(this.questions.splice(questionIdx, 1))
  }
}
