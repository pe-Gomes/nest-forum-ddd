import { EntityID } from '@/core/entities/value-objects/entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { type Prisma, type Attachment } from '@prisma/client'

export class PrismaQuestionAttachmentMapper {
  static toEntity(attach: Attachment): QuestionAttachment {
    if (!attach.questionId) {
      throw new Error('Invalid attachment type.')
    }

    return QuestionAttachment.create(
      {
        attachmentId: new EntityID(attach.id),
        questionId: new EntityID(attach.questionId),
      },
      new EntityID(attach.id),
    )
  }

  static toPersistenceUpdateMany(
    attachs: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds = attachs.map((attachment) => attachment.id.toString())

    return {
      where: {
        id: {
          in: attachmentsIds,
        },
      },
      data: {
        questionId: attachs[0].questionId.toString(),
      },
    }
  }
}
