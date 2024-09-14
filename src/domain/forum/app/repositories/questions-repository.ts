import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type Question } from '../../enterprise/entities/question'

export interface QuestionsRepository {
  create(question: Question): Promise<void>

  getBySlug(slug: string): Promise<Question | null>
  getById(id: string): Promise<Question | null>

  getMany({ page, limit }: PaginationParams): Promise<Question[]>

  update(question: Question): Promise<void>

  delete(id: string): Promise<void>
}
