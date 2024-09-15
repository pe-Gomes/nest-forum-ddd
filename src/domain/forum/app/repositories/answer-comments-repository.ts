import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type AnswerComment } from '../../enterprise/entities/answer-comment'

export abstract class AnswerCommentsRepository {
  abstract create(comment: AnswerComment): Promise<void>
  abstract getById(id: string): Promise<AnswerComment | null>
  abstract getManyByAnswerId(
    answerId: string,
    { page, limit }: PaginationParams,
  ): Promise<AnswerComment[]>
  abstract delete(id: string): Promise<void>
}
