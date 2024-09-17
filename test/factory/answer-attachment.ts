import { EntityID } from '@/core/entities/value-objects/entity-id'
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function createAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: EntityID,
) {
  return AnswerAttachment.create(
    {
      answerId: new EntityID(),
      attachmentId: new EntityID(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class AsnwerAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makeAnswerAttachment(
    data: Partial<AnswerAttachmentProps> = {},
  ): Promise<AnswerAttachment> {
    const attach = createAnswerAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: attach.attachmentId.toString(),
      },
      data: {
        answerId: attach.answerId.toString(),
      },
    })

    return attach
  }
}
