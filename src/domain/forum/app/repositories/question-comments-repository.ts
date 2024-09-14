import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionCommentsRepository {
  create(comment: QuestionComment): Promise<void>

  getById(id: string): Promise<QuestionComment | null>

  getManyByQuestionId(
    questionId: string,
    { page, limit }: PaginationParams,
  ): Promise<QuestionComment[]>

  delete(id: string): Promise<void>
}
