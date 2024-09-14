import { EntityID } from '@/core/entities/value-objects/entity-id'
import {
  QuestionAttachment,
  type QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'

export function createQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {},
  id?: EntityID,
) {
  return QuestionAttachment.create(
    {
      questionId: new EntityID(),
      attachmentId: new EntityID(),
      ...override,
    },
    id,
  )
}
