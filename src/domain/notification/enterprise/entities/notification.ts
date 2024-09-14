import { type EntityID } from '@/core/entities/value-objects/entity-id'

import { Entity } from '@/core/entities/entity'
import { type Optional } from '@/core/types/optional'

export type NotificationProps = {
  recipientId: EntityID
  title: string
  content: string
  createdAt: Date
  readAt?: Date
}

export type CreateNotificationArgs = Optional<NotificationProps, 'createdAt'>

export class Notification extends Entity<NotificationProps> {
  static create(props: CreateNotificationArgs, id?: EntityID) {
    return new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  read() {
    this.props.readAt = new Date()
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get readAt() {
    return this.props.readAt
  }

  get recipientId() {
    return this.props.recipientId
  }
}
