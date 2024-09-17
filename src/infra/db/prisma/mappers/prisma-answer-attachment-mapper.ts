import { EntityID } from '@/core/entities/value-objects/entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { type Prisma, type Attachment } from '@prisma/client'

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

  static toPersistenceUpdateMany(
    attachments: AnswerAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds = attachments.map((attachment) =>
      attachment.attachmentId.toString(),
    )

    return {
      where: {
        id: {
          in: attachmentsIds,
        },
      },
      data: {
        answerId: attachments[0].answerId.toString(),
      },
    }
  }
}
