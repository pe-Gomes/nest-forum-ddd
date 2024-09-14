import { describe, beforeEach, it, expect } from 'vitest'
import { InMemoryNotificationRepository } from '@tests/in-memory-repository/notification-repository'
import { ReadNotificationUseCase } from './read-notification'
import { createNotification } from '@tests/factory/notification'

let notificationRepository: InMemoryNotificationRepository
let sut: ReadNotificationUseCase

describe('Read Notification Use Case', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository()
    sut = new ReadNotificationUseCase(notificationRepository)
  })

  it('Should read a notification', async () => {
    const notification = createNotification()

    await notificationRepository.create(notification)

    expect(notificationRepository.notifications[0].readAt).toBeUndefined()

    await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
    })

    expect(notificationRepository.notifications[0].readAt).toBeDefined()
  })
})
