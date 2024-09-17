import { type Notification } from '../../enterprise/entities/notification'

export abstract class NotificationsRepository {
  abstract create(notification: Notification): Promise<void>
  abstract getById(id: string): Promise<Notification | null>
  abstract update(notification: Notification): Promise<void>
}
