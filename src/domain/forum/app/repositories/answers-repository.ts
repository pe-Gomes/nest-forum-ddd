import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type Answer } from '../../enterprise/entities/answer'

type FindManyByQuestionIdArgs = {
  questionId: string
} & PaginationParams

export abstract class AnswersRepository {
  abstract create(answer: Answer): Promise<void>
  abstract getById(id: string): Promise<Answer | null>
  abstract findManyByQuestionId({
    questionId,
    page,
    limit,
  }: FindManyByQuestionIdArgs): Promise<Answer[]>
  abstract update(answer: Answer): Promise<void>
  abstract delete(id: string): Promise<void>
}
