import { AnswersRepository } from '../repositories/answers-repository'
import { Answer } from '../../enterprise/entities/answer'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { success, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'

type ListRecentAnswersRequest = {
  questionId: string
} & PaginationParams

type ListRecentAnswersResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

@Injectable()
export class ListAnswersForQuestionUseCase {
  constructor(private answerRepository: AnswersRepository) {}
  async execute({
    questionId,
    page,
    limit,
  }: ListRecentAnswersRequest): Promise<ListRecentAnswersResponse> {
    const answers = await this.answerRepository.findManyByQuestionId({
      page,
      questionId,
      limit,
    })

    return success({ answers })
  }
}
