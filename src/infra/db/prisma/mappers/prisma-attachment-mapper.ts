import { EntityID } from '@/core/entities/value-objects/entity-id'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import {
  type Prisma,
  type Attachment as PrismaAttachment,
} from '@prisma/client'

export class PrismaAttachmentMapper {
  static toEntity(data: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        title: data.title,
        link: data.url,
      },
      new EntityID(data.id),
    )
  }

  static toPersistence(att: Attachment): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: att.id.toString(),
      title: att.title,
      url: att.link,
    }
  }
}
