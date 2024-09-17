import { NotificationsRepository } from '@/domain/notification/app/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper'

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private db: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPersistence(notification)

    await this.db.notification.create({ data })
  }

  async getById(id: string): Promise<Notification | null> {
    const notification = await this.db.notification.findUnique({
      where: { id },
    })

    if (!notification) return null

    return PrismaNotificationMapper.toEntity(notification)
  }

  async update(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPersistence(notification)

    await this.db.notification.update({
      where: { id: notification.id.toString() },
      data,
    })
  }
}
