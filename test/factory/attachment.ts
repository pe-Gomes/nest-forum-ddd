import { EntityID } from '@/core/entities/value-objects/entity-id'
import {
  Attachment,
  AttachmentProps,
} from '@/domain/forum/enterprise/entities/attachment'
import { PrismaAttachmentMapper } from '@/infra/db/prisma/mappers/prisma-attachment-mapper'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function createAttachment(
  overrides: Partial<AttachmentProps> = {},
  id?: EntityID,
) {
  return Attachment.create(
    {
      title: faker.lorem.words(3),
      link: faker.internet.url(),
      ...overrides,
    },
    id,
  )
}

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAttachment(
    data: Partial<AttachmentProps> = {},
  ): Promise<Attachment> {
    const attach = createAttachment(data)

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPersistence(attach),
    })

    return attach
  }
}
