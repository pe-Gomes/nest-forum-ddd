import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type AnswersRepository } from '@/domain/forum/app/repositories/answers-repository'
import { type Answer } from '@/domain/forum/enterprise/entities/answer'

export class PrismaAnswersRepository implements AnswersRepository {
  create(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }
  getById(id: string): Promise<Answer | null> {
    throw new Error('Method not implemented.')
  }
  findManyByQuestionId({
    questionId,
    page,
    limit,
  }: { questionId: string } & PaginationParams): Promise<Answer[]> {
    throw new Error('Method not implemented.')
  }
  update(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
