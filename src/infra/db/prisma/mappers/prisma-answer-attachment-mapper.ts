import { EntityID } from '@/core/entities/value-objects/entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { type Attachment } from '@prisma/client'

export class PrismaAnswerAttachmentMapper {
  static toEntity(attach: Attachment): AnswerAttachment {
    if (!attach.answerId) {
      throw new Error('Invalid attachment type.')
    }

    return AnswerAttachment.create(
      {
        attachmentId: new EntityID(attach.id),
        answerId: new EntityID(attach.answerId),
      },
      new EntityID(attach.id),
    )
  }
}
