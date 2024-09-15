import { QuestionAttachmentsRepository } from '@/domain/forum/app/repositories/question-attachments-repository'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private db: PrismaService) {}

  async getManyByQuestionId(questionId: string) {
    const questionAttachs = await this.db.attachment.findMany({
      where: { questionId },
    })

    return questionAttachs.map((a) =>
      PrismaQuestionAttachmentMapper.toEntity(a),
    )
  }

  async deleteManyByQuestionId(questionId: string) {
    await this.db.attachment.deleteMany({ where: { questionId } })
  }
}
