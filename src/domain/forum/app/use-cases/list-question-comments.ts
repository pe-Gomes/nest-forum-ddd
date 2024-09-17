import { Either, success } from '@/core/either'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

type ListQuestionCommentsRequest = {
  questionId: string
  page: number
  limit: number
}

type ListQuestionCommentsResponse = Either<
  null,
  {
    comments: CommentWithAuthor[]
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
    const comments =
      await this.questionRepository.getManyByQuestionIdWithAuthor(questionId, {
        page,
        limit,
      })

    return success({ comments })
  }
}
