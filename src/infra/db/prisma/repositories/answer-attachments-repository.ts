import { type AnswerAttachmentsRepository } from '@/domain/forum/app/repositories/answer-attachments-repository'
import { type AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  getManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    throw new Error('Method not implemented.')
  }
  deleteManyByAnswerId(answerId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
