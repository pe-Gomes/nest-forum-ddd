import { Either, failure, success } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'
import { Injectable } from '@nestjs/common'

type DeleteAnswerCommentRequest = {
  commentId: string
  authorId: string
}

type DeleteAnswerCommentResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

@Injectable()
export class DeleteAnswerCommentUseCase {
  constructor(private commentRepository: AnswerCommentsRepository) {}

  async execute({
    commentId,
    authorId,
  }: DeleteAnswerCommentRequest): Promise<DeleteAnswerCommentResponse> {
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
