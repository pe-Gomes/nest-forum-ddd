import { type Answer } from '@/domain/forum/enterprise/entities/answer'

type HttpAnswerPresenter = {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date | null
}

export class AnswerPresenter {
  static toHTTP(answer: Answer): HttpAnswerPresenter {
    return {
      id: answer.id.toString(),
      content: answer.content,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt ?? null,
    }
  }
}
