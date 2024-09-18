import { type EntityID } from '@/core/entities/value-objects/entity-id'
import { type DomainEvent } from '@/core/events/domain-events'
import { type Question } from '../entities/question'

export class SetQuestionBestAnswerEvent implements DomainEvent {
  public occuredAt: Date
  public question: Question
  public bestAnswerId: EntityID

  constructor(question: Question, bestAnswerId: EntityID) {
    this.question = question
    this.bestAnswerId = bestAnswerId
    this.occuredAt = new Date()
  }

  getAggregateId(): EntityID {
    return this.question.id
  }
}
