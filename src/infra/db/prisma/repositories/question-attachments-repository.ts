import { QuestionAttachmentsRepository } from '@/domain/forum/app/repositories/question-attachments-repository'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment'
import { Injectable } from '@nestjs/common'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private db: PrismaService) {}

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) return

    const data =
      PrismaQuestionAttachmentMapper.toPersistenceUpdateMany(attachments)

    await this.db.attachment.updateMany(data)
  }

  async getManyByQuestionId(questionId: string) {
    const questionAttachs = await this.db.attachment.findMany({
      where: { questionId },
    })

    return questionAttachs.map((a) =>
      PrismaQuestionAttachmentMapper.toEntity(a),
    )
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    const attachmentsIds = attachments.map((att) => att.id.toString())

    await this.db.attachment.deleteMany({
      where: { id: { in: attachmentsIds } },
    })
  }

  async deleteManyByQuestionId(questionId: string) {
    await this.db.attachment.deleteMany({ where: { questionId } })
  }
}
