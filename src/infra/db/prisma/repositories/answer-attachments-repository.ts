import { type AnswerAttachmentsRepository } from '@/domain/forum/app/repositories/answer-attachments-repository'
import { type AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { type PrismaService } from '../prisma.service'
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper'

export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private readonly db: PrismaService) {}

  async getManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const attachs = await this.db.attachment.findMany({
      where: { answerId },
    })

    return attachs.map((att) => PrismaAnswerAttachmentMapper.toEntity(att))
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.db.attachment.deleteMany({ where: { answerId } })
  }
}
