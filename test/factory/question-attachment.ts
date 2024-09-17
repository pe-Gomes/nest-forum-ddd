import { EntityID } from '@/core/entities/value-objects/entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function createQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {},
  id?: EntityID,
) {
  return QuestionAttachment.create(
    {
      questionId: new EntityID(),
      attachmentId: new EntityID(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionAttachment(
    data: Partial<QuestionAttachmentProps> = {},
  ): Promise<QuestionAttachment> {
    const questionAttachment = createQuestionAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: questionAttachment.attachmentId.toString(),
      },
      data: {
        questionId: questionAttachment.questionId.toString(),
      },
    })

    return questionAttachment
  }
}
