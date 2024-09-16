import { Either, success } from '@/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { Injectable } from '@nestjs/common'

type ListQuestionCommentsRequest = {
  questionId: string
  page: number
  limit: number
}

type ListQuestionCommentsResponse = Either<
  null,
  {
    comments: QuestionComment[]
  }
>

@Injectable()
export class ListQuestionCommentsUseCase {
  constructor(private questionRepository: QuestionCommentsRepository) {}
  async execute({
    questionId,
    page,
    limit,
  }: ListQuestionCommentsRequest): Promise<ListQuestionCommentsResponse> {
    const comments = await this.questionRepository.getManyByQuestionId(
      questionId,
      { page, limit },
    )

    return success({ comments })
  }
}
