import { type EntityID } from '@/core/entities/value-objects/entity-id'
import { Comment, type CommentProps } from './comment'
import { type Optional } from '@/core/types/optional'

export interface AnswerCommentProps extends CommentProps {
  answerId: EntityID
}

type CreateAnswerCommentArgs = Optional<AnswerCommentProps, 'createdAt'>

export class AnswerComment extends Comment<AnswerCommentProps> {
  public static create(
    args: CreateAnswerCommentArgs,
    id?: EntityID,
  ): AnswerComment {
    return new AnswerComment(
      {
        ...args,
        createdAt: args.createdAt ?? new Date(),
      },
      id,
    )
  }

  get answerId() {
    return this.props.answerId
  }
}
