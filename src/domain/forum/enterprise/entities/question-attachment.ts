import { Entity } from '@/core/entities/entity'
import { type EntityID } from '@/core/entities/value-objects/entity-id'

export type QuestionAttachmentProps = {
  questionId: EntityID
  attachmentId: EntityID
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  static create(props: QuestionAttachmentProps, id?: EntityID) {
    return new QuestionAttachment(props, id)
  }

  get questionId() {
    return this.props.questionId
  }

  get attachmentId() {
    return this.props.attachmentId
  }
}
