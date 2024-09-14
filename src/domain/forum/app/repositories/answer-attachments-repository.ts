import { type AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export interface AnswerAttachmentsRepository {
  getManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>

  deleteManyByAnswerId(answerId: string): Promise<void>
}
