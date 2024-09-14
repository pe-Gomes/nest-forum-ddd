import { type QuestionAttachment } from '../../enterprise/entities/question-attachment'

export interface QuestionAttachmentsRepository {
  getManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>

  deleteManyByQuestionId(questionId: string): Promise<void>
}
