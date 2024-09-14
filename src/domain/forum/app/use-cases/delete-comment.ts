import { type Either, failure, success } from '@/core/either'
import { type AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { type QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'

type DeleteCommentRequest = {
  commentId: string
  authorId: string
}

type DeleteCommentResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

export class DeleteCommentUseCase {
  constructor(
    private commentRepository:
      | QuestionCommentsRepository
      | AnswerCommentsRepository,
  ) {}

  async execute({
    commentId,
    authorId,
  }: DeleteCommentRequest): Promise<DeleteCommentResponse> {
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
