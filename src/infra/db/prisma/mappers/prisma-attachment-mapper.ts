import { type Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { type Prisma } from '@prisma/client'

export class PrismaAttachmentMapper {
  static toPersistence(att: Attachment): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: att.id.toString(),
      title: att.title,
      url: att.link,
    }
  }
}
