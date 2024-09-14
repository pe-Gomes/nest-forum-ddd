import { type EntityID } from '@/core/entities/value-objects/entity-id'

import { Entity } from '@/core/entities/entity'

type StudentProps = {
  name: string
}

export class Student extends Entity<StudentProps> {
  create(args: StudentProps, id?: EntityID) {
    return new Student(args, id)
  }

  get name() {
    return this.props.name
  }
}
