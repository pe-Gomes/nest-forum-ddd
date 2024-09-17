import { AnswerAttachmentsRepository } from '@/domain/forum/app/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private readonly db: PrismaService) {}

  async createMany(answerAttachments: AnswerAttachment[]): Promise<void> {
    if (answerAttachments.length === 0) return

    const data =
      PrismaAnswerAttachmentMapper.toPersistenceUpdateMany(answerAttachments)

    await this.db.attachment.updateMany(data)
  }

  async getManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const attachs = await this.db.attachment.findMany({
      where: { answerId },
    })

    return attachs.map((att) => PrismaAnswerAttachmentMapper.toEntity(att))
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) return

    const attachmentsIds = attachments.map((att) => att.id.toString())

    await this.db.attachment.deleteMany({
      where: { id: { in: attachmentsIds } },
    })
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.db.attachment.deleteMany({ where: { answerId } })
  }
}
