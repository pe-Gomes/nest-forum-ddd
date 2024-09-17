import { type QuestionAttachment } from '../../enterprise/entities/question-attachment'

export abstract class QuestionAttachmentsRepository {
  abstract createMany(attachments: QuestionAttachment[]): Promise<void>
  abstract getManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]>
  abstract deleteManyByQuestionId(questionId: string): Promise<void>
  abstract deleteMany(attachments: QuestionAttachment[]): Promise<void>
}
