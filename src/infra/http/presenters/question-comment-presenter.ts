import { type QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

type QuestionCommentHTTP = {
  id: string
  content: string
  authorId: string
  createdAt: Date
  updatedAt: Date | null
}

export class QuestionCommentPresenter {
  static toHTTP(comment: QuestionComment): QuestionCommentHTTP {
    return {
      id: comment.id.toString(),
      content: comment.content,
      authorId: comment.authorId.toString(),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt ?? null,
    }
  }
}
