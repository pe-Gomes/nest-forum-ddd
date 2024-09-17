import { type QuestionAttachmentsRepository } from '@/domain/forum/app/repositories/question-attachments-repository'
import { type QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentsRepository
{
  public questionAttachments: QuestionAttachment[] = []

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.questionAttachments.push(...attachments)
  }

  async getManyByQuestionId(questionId: string) {
    return await Promise.resolve(
      this.questionAttachments.filter(
        (item) => item.questionId.toString() === questionId,
      ),
    )
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    const questionAttachments = this.questionAttachments.filter((item) => {
      return !attachments.some((att) => att.equals(item))
    })

    this.questionAttachments = questionAttachments
  }

  async deleteManyByQuestionId(questionId: string) {
    await Promise.resolve(
      (this.questionAttachments = this.questionAttachments.filter(
        (item) => item.questionId.toString() !== questionId,
      )),
    )
  }
}
