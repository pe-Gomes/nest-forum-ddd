import { type Question } from '@/domain/forum/enterprise/entities/question'

export type HttpQuestionPresenter = {
  id: string
  title: string
  slug: string
  excerpt: string
  authorId: string
  bestAnswerId: string | null
  createdAt: Date
  updatedAt: Date | null
}

export class QuestionPresenter {
  static toHTTP(question: Question): HttpQuestionPresenter {
    return {
      id: question.id.toString(),
      title: question.title,
      slug: question.slug.value,
      excerpt: question.excerpt,
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId?.toString() ?? null,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt ?? null,
    }
  }
}
