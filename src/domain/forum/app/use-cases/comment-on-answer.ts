import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { EntityID } from '@/core/entities/value-objects/entity-id'
import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors'
import { Injectable } from '@nestjs/common'

type CommentOnAnswerRequest = {
  authorId: string
  answerId: string
  content: string
}

type CommentOnAnswerResponse = Either<
  ResourceNotFoundError,
  {
    comment: AnswerComment
  }
>

@Injectable()
export class CommentOnAnswerUseCase {
  constructor(
    private answerRepository: AnswersRepository,
    private answerCommentRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerRequest): Promise<CommentOnAnswerResponse> {
    const answer = await this.answerRepository.getById(answerId)

    if (!answer) {
      return failure(new ResourceNotFoundError())
    }

    const comment = AnswerComment.create({
      authorId: new EntityID(authorId),
      answerId: answer.id,
      content,
    })

    await this.answerCommentRepository.create(comment)

    return success({ comment })
  }
}
