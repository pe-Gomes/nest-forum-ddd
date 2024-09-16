import { type AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

type AnswerCommentHTTP = {
  id: string
  content: string
  authorId: string
  createdAt: Date
  updatedAt: Date | null
}

export class AnswerCommentPresenter {
  static toHTTP(comment: AnswerComment): AnswerCommentHTTP {
    return {
      id: comment.id.toString(),
      content: comment.content,
      authorId: comment.authorId.toString(),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt ?? null,
    }
  }
}
