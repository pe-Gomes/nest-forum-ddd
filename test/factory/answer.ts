import { EntityID } from '@/core/entities/value-objects/entity-id'
import {
  type AnswerProps,
  Answer,
} from '@/domain/forum/enterprise/entities/answer'
import { faker } from '@faker-js/faker'

export function createAnswer(
  overrides: Partial<AnswerProps> = {},
  id?: EntityID,
) {
  return Answer.create(
    {
      content: faker.lorem.text(),
      authorId: new EntityID(),
      questionId: new EntityID(),
      ...overrides,
    },
    id,
  )
}
