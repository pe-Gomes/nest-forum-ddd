import { type NotificationsRepository } from '@/domain/notification/app/repositories/notifications-repository'
import { type Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationRepository implements NotificationsRepository {
  public notifications: Notification[] = []

  async create(notification: Notification) {
    this.notifications.push(notification)
  }

  async getById(id: string): Promise<Notification | null> {
    return (
      this.notifications.find(
        (notification) => notification.id.toString() === id,
      ) ?? null
    )
  }
  async update(notification: Notification): Promise<void> {
    const notificationIdx = this.notifications.findIndex(
      (n) => n.id.toString() === notification.id.toString(),
    )

    this.notifications[notificationIdx] = notification
  }
}
