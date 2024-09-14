import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { type Question } from '../../enterprise/entities/question'
import { type Either, success } from '@/core/either'

type ListRecentQuestionsRequest = PaginationParams

type ListRecentQuestionsResponse = Either<
  null,
  {
    questions: Question[]
  }
>

export class ListRecentQuestionsUseCase {
  constructor(private questionRepository: QuestionsRepository) {}
  async execute({
    page,
    limit,
  }: ListRecentQuestionsRequest): Promise<ListRecentQuestionsResponse> {
    const questions = await this.questionRepository.getMany({
      page,
      limit,
    })

    return success({ questions })
  }
}
