import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type Question } from '../../enterprise/entities/question'
import { type Either, success } from '@/core/either'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Injectable } from '@nestjs/common'

type ListRecentQuestionsRequest = PaginationParams

type ListRecentQuestionsResponse = Either<
  null,
  {
    questions: Question[]
  }
>

@Injectable()
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
