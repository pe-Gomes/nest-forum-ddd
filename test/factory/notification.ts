import { EntityID } from '@/core/entities/value-objects/entity-id'
import {
  Notification,
  type NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { faker } from '@faker-js/faker'

export function createNotification(
  overrides: Partial<NotificationProps> = {},
  id?: EntityID,
) {
  return Notification.create(
    {
      recipientId: new EntityID(),
      title: faker.lorem.sentence(3),
      content: faker.lorem.sentence(10),
      ...overrides,
    },
    id,
  )
}
