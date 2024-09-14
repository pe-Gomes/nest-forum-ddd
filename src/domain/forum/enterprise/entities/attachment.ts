import { type EntityID } from '@/core/entities/value-objects/entity-id'
import { Entity } from '@/core/entities/entity'

interface AttachmentProps {
  title: string
  link: string
}

export class Attachement extends Entity<AttachmentProps> {
  static create(props: AttachmentProps, id?: EntityID) {
    return new Attachement(props, id)
  }

  get title() {
    return this.props.title
  }

  get link() {
    return this.props.link
  }
}
