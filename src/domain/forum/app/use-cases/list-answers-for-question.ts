import { type AnswersRepository } from '../repositories/answers-repository'
import { type Answer } from '../../enterprise/entities/answer'
import { type PaginationParams } from '@/core/repositories/pagination-params'
import { success, type Either } from '@/core/either'

type ListRecentAnswersRequest = {
  questionId: string
} & PaginationParams

type ListRecentAnswersResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

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
