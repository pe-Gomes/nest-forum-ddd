import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type QuestionComment } from '../../enterprise/entities/question-comment'

export abstract class QuestionCommentsRepository {
  abstract create(comment: QuestionComment): Promise<void>
  abstract getById(id: string): Promise<QuestionComment | null>
  abstract getManyByQuestionId(
    questionId: string,
    { page, limit }: PaginationParams,
  ): Promise<QuestionComment[]>
  abstract delete(id: string): Promise<void>
}
