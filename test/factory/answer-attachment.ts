import { EntityID } from '@/core/entities/value-objects/entity-id'
import {
  AnswerAttachment,
  type AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'

export function createAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: EntityID,
) {
  return AnswerAttachment.create(
    {
      answerId: new EntityID(),
      attachmentId: new EntityID(),
      ...override,
    },
    id,
  )
}
