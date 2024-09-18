import { EntityID } from '@/core/entities/value-objects/entity-id'
import { Notification } from '../../enterprise/entities/notification'

import { Either, success } from '@/core/either'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { Injectable } from '@nestjs/common'

export type SendNotificationRequest = {
  recipientId: string
  title: string
  content: string
}

export type SendNotificationResponse = Either<
  null,
  { notification: Notification }
>

@Injectable()
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
