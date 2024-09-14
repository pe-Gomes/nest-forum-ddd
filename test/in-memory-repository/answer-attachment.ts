import { type AnswerAttachmentsRepository } from '@/domain/forum/app/repositories/answer-attachments-repository'
import { type AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentRepository
  implements AnswerAttachmentsRepository
{
  public answerAttachments: AnswerAttachment[] = []

  async getManyByAnswerId(answerId: string) {
    return await Promise.resolve(
      this.answerAttachments.filter(
        (item) => item.answerId.toString() === answerId,
      ),
    )
  }

  async deleteManyByAnswerId(answerId: string) {
    await Promise.resolve(
      (this.answerAttachments = this.answerAttachments.filter(
        (item) => item.answerId.toString() !== answerId,
      )),
    )
  }
}
