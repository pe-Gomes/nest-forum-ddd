import { Either, failure, success } from '@/core/either'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'
import { Injectable } from '@nestjs/common'

type DeleteQuestionCommentRequest = {
  commentId: string
  authorId: string
}

type DeleteQuestionCommentResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

@Injectable()
export class DeleteQuestionCommentUseCase {
  constructor(private commentRepository: QuestionCommentsRepository) {}

  async execute({
    commentId,
    authorId,
  }: DeleteQuestionCommentRequest): Promise<DeleteQuestionCommentResponse> {
    const comment = await this.commentRepository.getById(commentId)

    if (!comment) {
      return failure(new ResourceNotFoundError())
    }

    if (comment.authorId.toString() !== authorId) {
      return failure(new NotAllowedError())
    }

    await this.commentRepository.delete(commentId)

    return success({})
  }
}
