import { type AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export abstract class AnswerAttachmentsRepository {
  abstract createMany(answerAttachments: AnswerAttachment[]): Promise<void>
  abstract getManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  abstract deleteMany(answerAttachments: AnswerAttachment[]): Promise<void>
  abstract deleteManyByAnswerId(answerId: string): Promise<void>
}
