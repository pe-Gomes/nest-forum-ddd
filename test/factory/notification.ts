import { EntityID } from '@/core/entities/value-objects/entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { PrismaNotificationMapper } from '@/infra/db/prisma/mappers/prisma-notification-mapper'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class NotificationFactory {
  constructor(private db: PrismaService) {}

  async makePrismaNotification(
    overrides: Partial<NotificationProps> = {},
    id?: EntityID,
  ) {
    const notification = createNotification(overrides, id)

    await this.db.notification.create({
      data: PrismaNotificationMapper.toPersistence(notification),
    })

    return notification
  }
}
