import { success, Either } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

type ListAnswerCommentsRequest = {
  answerId: string
  page: number
  limit: number
}

type ListAnswerCommentsResponse = Either<
  null,
  {
    comments: CommentWithAuthor[]
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
    const comments = await this.answerRepository.getManyByQuestionIdWithAuthor(
      answerId,
      {
        page,
        limit,
      },
    )

    return success({ comments })
  }
}
