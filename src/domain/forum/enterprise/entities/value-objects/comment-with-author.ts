import { ValueObject } from '@/core/entities/value-objects'
import { type EntityID } from '@/core/entities/value-objects/entity-id'

export type CommentWithAuthorProps = {
  commentId: EntityID
  content: string
  authorId: EntityID
  authorName: string
  createdAt: Date
  updatedAt: Date | null
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  static create(props: CommentWithAuthorProps) {
    return new CommentWithAuthor(props)
  }

  get commentId() {
    return this.props.commentId
  }

  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get authorName() {
    return this.props.authorName
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}
