import { type AnswerAttachmentsRepository } from '@/domain/forum/app/repositories/answer-attachments-repository'
import { type AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentRepository
  implements AnswerAttachmentsRepository
{
  public answerAttachments: AnswerAttachment[] = []

  async createMany(answerAttachments: AnswerAttachment[]): Promise<void> {
    this.answerAttachments.push(...answerAttachments)
  }

  async getManyByAnswerId(answerId: string) {
    return await Promise.resolve(
      this.answerAttachments.filter(
        (item) => item.answerId.toString() === answerId,
      ),
    )
  }

  async deleteMany(answerAttachments: AnswerAttachment[]): Promise<void> {
    const attachments = answerAttachments.filter(
      (item) => !answerAttachments.some((att) => att.equals(item)),
    )

    this.answerAttachments = attachments
  }

  async deleteManyByAnswerId(answerId: string) {
    await Promise.resolve(
      (this.answerAttachments = this.answerAttachments.filter(
        (item) => item.answerId.toString() !== answerId,
      )),
    )
  }
}
