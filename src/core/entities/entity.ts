import { EntityID } from './value-objects/entity-id'

export class Entity<EntityProperties> {
  private _id: EntityID
  protected props: EntityProperties

  protected constructor(props: EntityProperties, id?: EntityID) {
    this.props = props
    this._id = id ?? new EntityID()
  }

  public equals(entity: Entity<unknown>) {
    if (entity === this) {
      return true
    }

    if (entity.id === this._id) {
      return true
    }

    return false
  }

  get id() {
    return this._id
  }
}
