import { success, Either } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { Injectable } from '@nestjs/common'

type ListAnswerCommentsRequest = {
  answerId: string
  page: number
  limit: number
}

type ListAnswerCommentsResponse = Either<
  null,
  {
    comments: AnswerComment[]
  }
>

@Injectable()
export class ListAnswerCommentsUseCase {
  constructor(private answerRepository: AnswerCommentsRepository) {}
  async execute({
    answerId,
    page,
    limit,
  }: ListAnswerCommentsRequest): Promise<ListAnswerCommentsResponse> {
    const comments = await this.answerRepository.getManyByAnswerId(answerId, {
      page,
      limit,
    })

    return success({ comments })
  }
}
