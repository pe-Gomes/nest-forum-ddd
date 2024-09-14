import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { type AnswersRepository } from '../repositories/answers-repository'
import { type AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { EntityID } from '@/core/entities/value-objects/entity-id'

type CommentOnAnswerRequest = {
  authorId: string
  answerId: string
  content: string
}

type CommentOnAnswerResponse = {
  comment: AnswerComment
}

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
      throw new Error('Answer not found')
    }

    const comment = AnswerComment.create({
      authorId: new EntityID(authorId),
      answerId: answer.id,
      content,
    })

    await this.answerCommentRepository.create(comment)

    return { comment }
  }
}
