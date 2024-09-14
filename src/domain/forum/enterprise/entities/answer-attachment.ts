import { Entity } from '@/core/entities/entity'
import { type EntityID } from '@/core/entities/value-objects/entity-id'

export type AnswerAttachmentProps = {
  answerId: EntityID
  attachmentId: EntityID
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  static create(props: AnswerAttachmentProps, id?: EntityID) {
    return new AnswerAttachment(props, id)
  }

  get answerId() {
    return this.props.answerId
  }

  get attachmentId() {
    return this.props.attachmentId
  }
}
