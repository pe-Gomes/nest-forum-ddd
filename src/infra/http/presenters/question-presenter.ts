import { type Question } from '@/domain/forum/enterprise/entities/question'

export type HttpQuestionPresenter = {
  id: string
  title: string
  content?: string
  slug: string
  excerpt?: string
  authorId: string
  bestAnswerId: string | null
  createdAt: Date
  updatedAt: Date | null
}

export class QuestionPresenter {
  static toHTTP(question: Question, isComplete = false): HttpQuestionPresenter {
    return {
      id: question.id.toString(),
      title: question.title,
      content: isComplete ? question.content : undefined,
      slug: question.slug.value,
      excerpt: isComplete ? undefined : question.excerpt,
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId?.toString() ?? null,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt ?? null,
    }
  }
}
