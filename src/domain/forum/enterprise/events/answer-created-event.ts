import { type EntityID } from '@/core/entities/value-objects/entity-id'
import { type DomainEvent } from '@/core/events/domain-events'
import { type Answer } from '../entities/answer'

export class AnswerCreatedEvent implements DomainEvent {
  public occuredAt: Date
  public answer: Answer

  constructor(answer: Answer) {
    this.answer = answer
    this.occuredAt = new Date()
  }

  getAggregateId(): EntityID {
    return this.answer.id
  }
}
