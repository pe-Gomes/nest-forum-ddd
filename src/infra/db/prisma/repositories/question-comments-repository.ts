import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/app/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  async create(comment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async getById(id: string): Promise<QuestionComment | null> {
    throw new Error('Method not implemented.')
  }
  async getManyByQuestionId(
    questionId: string,
    { page, limit }: PaginationParams,
  ): Promise<QuestionComment[]> {
    throw new Error('Method not implemented.')
  }
  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
