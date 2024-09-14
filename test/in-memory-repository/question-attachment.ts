import { type QuestionAttachmentsRepository } from '@/domain/forum/app/repositories/question-attachments-repository'
import { type QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentsRepository
{
  public questionAttachments: QuestionAttachment[] = []

  async getManyByQuestionId(questionId: string) {
    return await Promise.resolve(
      this.questionAttachments.filter(
        (item) => item.questionId.toString() === questionId,
      ),
    )
  }

  async deleteManyByQuestionId(questionId: string) {
    await Promise.resolve(
      (this.questionAttachments = this.questionAttachments.filter(
        (item) => item.questionId.toString() !== questionId,
      )),
    )
  }
}
