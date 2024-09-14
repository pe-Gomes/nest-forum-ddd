import { describe, beforeEach, it, expect } from 'vitest'
import { InMemoryNotificationRepository } from '@tests/in-memory-repository/notification-repository'
import { SendNotificationUseCase } from './send-notification'

let notificationRepository: InMemoryNotificationRepository
let sut: SendNotificationUseCase

describe('Send Notification Use Case', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository()
    sut = new SendNotificationUseCase(notificationRepository)
  })

  it('Should create a notification', async () => {
    await sut.execute({
      recipientId: 'recipient-id',
      title: 'title',
      content: 'content',
    })

    expect(notificationRepository.notifications).toHaveLength(1)
    expect(notificationRepository.notifications[0].title).toBe('title')
    expect(notificationRepository.notifications[0].content).toBe('content')
    expect(notificationRepository.notifications[0].recipientId.toString()).toBe(
      'recipient-id',
    )
  })
})
