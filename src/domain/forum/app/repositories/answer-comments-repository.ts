import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswerCommentsRepository {
  create(comment: AnswerComment): Promise<void>

  getById(id: string): Promise<AnswerComment | null>

  getManyByAnswerId(
    answerId: string,
    { page, limit }: PaginationParams,
  ): Promise<AnswerComment[]>

  delete(id: string): Promise<void>
}
