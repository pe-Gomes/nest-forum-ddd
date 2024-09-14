import { describe, expect, it, vi } from 'vitest'
import { AggregateRoot } from '../entities/aggregate-root'
import { DomainEvents, type DomainEvent } from './domain-events'

class FooAggregateCreated implements DomainEvent {
  public occuredAt: Date
  private aggregate: FooAggregate

  constructor(aggregate: FooAggregate) {
    this.aggregate = aggregate
    this.occuredAt = new Date()
  }

  getAggregateId() {
    return this.aggregate.id
  }
}

class FooAggregate extends AggregateRoot<number> {
  static create() {
    const aggregate = new FooAggregate(Math.floor(Math.random() * 10))

    aggregate.addDomainEvent(new FooAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // Subscribe / Register to an event
    DomainEvents.register(callbackSpy, FooAggregateCreated.name)
    const aggregate = FooAggregate.create()

    expect(aggregate.domainEvents).toHaveLength(1)

    // Publish / Dispatch an event
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // Assert that the callback was called
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
