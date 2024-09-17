import { type Slug } from './slug'
import { type Attachment } from '../attachment'
import { type EntityID } from '@/core/entities/value-objects/entity-id'
import { ValueObject } from '@/core/entities/value-objects'

export type QuestionDetailsProps = {
  questionId: EntityID
  authorId: EntityID
  authorName: string
  title: string
  content: string
  slug: Slug
  attachments: Attachment[]
  bestAnswerId?: EntityID | null
  createdAt: Date
  updatedAt?: Date | null
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props)
  }

  get questionId() {
    return this.props.questionId
  }

  get authorId() {
    return this.props.authorId
  }

  get authorName() {
    return this.props.authorName
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get slug() {
    return this.props.slug
  }

  get attachments() {
    return this.props.attachments
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}
