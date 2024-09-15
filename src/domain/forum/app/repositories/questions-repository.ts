import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type Question } from '../../enterprise/entities/question'

export abstract class QuestionsRepository {
  abstract create(question: Question): Promise<void>
  abstract getBySlug(slug: string): Promise<Question | null>
  abstract getById(id: string): Promise<Question | null>
  abstract getMany({ page, limit }: PaginationParams): Promise<Question[]>
  abstract update(question: Question): Promise<void>
  abstract delete(id: string): Promise<void>
}
