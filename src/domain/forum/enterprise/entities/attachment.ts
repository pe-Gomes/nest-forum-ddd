import { type EntityID } from '@/core/entities/value-objects/entity-id'
import { Entity } from '@/core/entities/entity'

export interface AttachmentProps {
  title: string
  link: string
}

export class Attachment extends Entity<AttachmentProps> {
  static create(props: AttachmentProps, id?: EntityID) {
    return new Attachment(props, id)
  }

  get title() {
    return this.props.title
  }

  get link() {
    return this.props.link
  }
}
