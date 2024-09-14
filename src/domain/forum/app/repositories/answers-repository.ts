import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type Answer } from '../../enterprise/entities/answer'

type FindManyByQuestionIdArgs = {
  questionId: string
} & PaginationParams

export interface AnswersRepository {
  create(answer: Answer): Promise<void>

  getById(id: string): Promise<Answer | null>

  findManyByQuestionId({
    questionId,
    page,
    limit,
  }: FindManyByQuestionIdArgs): Promise<Answer[]>

  update(answer: Answer): Promise<void>

  delete(id: string): Promise<void>
}
