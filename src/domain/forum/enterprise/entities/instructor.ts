import { type EntityID } from '@/core/entities/value-objects/entity-id'

import { Entity } from '@/core/entities/entity'

type InstructorProps = {
  name: string
  email: string
  passwordHash: string
}

export class Instructor extends Entity<InstructorProps> {
  create(args: InstructorProps, id?: EntityID) {
    return new Instructor(args, id)
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get passwordHash() {
    return this.props.passwordHash
  }
}
