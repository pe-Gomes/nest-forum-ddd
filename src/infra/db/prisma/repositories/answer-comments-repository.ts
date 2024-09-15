import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type AnswerCommentsRepository } from '@/domain/forum/app/repositories/answer-comments-repository'
import { type AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  create(comment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.')
  }
  getById(id: string): Promise<AnswerComment | null> {
    throw new Error('Method not implemented.')
  }
  getManyByAnswerId(
    answerId: string,
    { page, limit }: PaginationParams,
  ): Promise<AnswerComment[]> {
    throw new Error('Method not implemented.')
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
