import { EntityID } from '@/core/entities/value-objects/entity-id'
import { Notification } from '../../enterprise/entities/notification'

import { type Either, success } from '@/core/either'
import { type NotificationsRepository } from '../repositories/notifications-repository'

type SendNotificationRequest = {
  recipientId: string
  title: string
  content: string
}

type SendNotificationResponse = Either<null, { notification: Notification }>

export class SendNotificationUseCase {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationRequest): Promise<SendNotificationResponse> {
    const notification = Notification.create({
      recipientId: new EntityID(recipientId),
      title,
      content,
    })

    await this.notificationRepository.create(notification)

    return success({ notification })
  }
}
