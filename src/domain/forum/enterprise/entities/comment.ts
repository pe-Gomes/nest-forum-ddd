import { Entity } from '@/core/entities/entity'
import { type EntityID } from '@/core/entities/value-objects/entity-id'

export interface CommentProps {
  authorId: EntityID
  content: string
  createdAt: Date
  updatedAt?: Date
}

export abstract class Comment<T extends CommentProps> extends Entity<T> {
  private touch() {
    this.props.updatedAt = new Date()
  }

  get authorId() {
    return this.props.authorId
  }

  get content() {
    return this.props.content
  }

  set content(value: string) {
    this.props.content = value
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}
