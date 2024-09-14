import {
  Question,
  type QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { EntityID } from '@/core/entities/value-objects/entity-id'

import { faker } from '@faker-js/faker'

export function createQuestion(
  override: Partial<QuestionProps> = {},
  id?: EntityID,
) {
  return Question.create(
    {
      title: faker.lorem.sentence(5),
      content: faker.lorem.text(),
      authorId: new EntityID(),
      ...override,
    },
    id,
  )
}
