import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type AnswerComment } from '../../enterprise/entities/answer-comment'
import { type CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

export abstract class AnswerCommentsRepository {
  abstract create(comment: AnswerComment): Promise<void>
  abstract getById(id: string): Promise<AnswerComment | null>
  abstract getManyByAnswerId(
    answerId: string,
    { page, limit }: PaginationParams,
  ): Promise<AnswerComment[]>
  abstract getManyByQuestionIdWithAuthor(
    questionId: string,
    { page, limit }: PaginationParams,
  ): Promise<CommentWithAuthor[]>
  abstract delete(id: string): Promise<void>
}
