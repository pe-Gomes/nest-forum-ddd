import { type EntityID } from '@/core/entities/value-objects/entity-id'
import { type Optional } from '@/core/types/optional'

import { QuestionAttachmentList } from './question-attachment-list'
import { Slug } from './value-objects/slug'
import { AggregateRoot } from '@/core/entities/aggregate-root'

import dayjs from 'dayjs'

export type QuestionProps = {
  title: string
  content: string
  slug: Slug
  bestAnswerId?: EntityID
  createdAt: Date
  updatedAt?: Date

  attachments: QuestionAttachmentList
  authorId: EntityID
}

/**
 * Create a type with 'createdAt' as optional. This is useful when creating a
 * new entity, because the date can be provided or not.
 */
type CreateQuestionArgs = Optional<
  QuestionProps,
  'createdAt' | 'slug' | 'attachments'
>

export class Question extends AggregateRoot<QuestionProps> {
  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: CreateQuestionArgs, id?: EntityID) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return question
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get slug() {
    return this.props.slug
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  set bestAnswerId(id: EntityID | undefined) {
    this.props.bestAnswerId = id
    this.touch()
  }

  get authorId() {
    return this.props.authorId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.createdAt
  }

  get isNew() {
    // Check if the question was created in the last 3 days
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
  }
}
