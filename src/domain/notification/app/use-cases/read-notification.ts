import { Notification } from '../../enterprise/entities/notification'
import { Either, failure, success } from '@/core/either'
import { NotificationsRepository } from '../repositories/notifications-repository'

import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'
import { Injectable } from '@nestjs/common'

type ReadNotificationRequest = {
  notificationId: string
  recipientId: string
}

type ReadNotificationResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { notification: Notification }
>

@Injectable()
export class ReadNotificationUseCase {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute({
    notificationId,
    recipientId,
  }: ReadNotificationRequest): Promise<ReadNotificationResponse> {
    const notification =
      await this.notificationRepository.getById(notificationId)

    if (!notification) {
      return failure(new ResourceNotFoundError())
    }

    if (notification.recipientId.toString() !== recipientId) {
      return failure(new NotAllowedError())
    }

    notification.read()

    await this.notificationRepository.update(notification)

    return success({ notification })
  }
}
