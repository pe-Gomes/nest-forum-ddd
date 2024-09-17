import { EntityID } from '@/core/entities/value-objects/entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import {
  type Prisma,
  type Notification as PrismaNotification,
} from '@prisma/client'

export class PrismaNotificationMapper {
  static toEntity(data: PrismaNotification): Notification {
    return Notification.create(
      {
        title: data.title,
        content: data.content,
        recipientId: new EntityID(data.userId),
        readAt: data.readAt ?? undefined,
        createdAt: data.createdAt,
      },
      new EntityID(data.id),
    )
  }

  static toPersistence(
    data: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: data.id.toString(),
      title: data.title,
      content: data.content,
      userId: data.recipientId.toString(),
      readAt: data.readAt,
      createdAt: data.createdAt,
    }
  }
}
