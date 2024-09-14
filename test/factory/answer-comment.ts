import { EntityID } from '@/core/entities/value-objects/entity-id'
import {
  AnswerComment,
  type AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'
import { faker } from '@faker-js/faker'

export function createAnswerComment(
  overrides: Partial<AnswerCommentProps> = {},
  id?: EntityID,
) {
  return AnswerComment.create(
    {
      authorId: new EntityID(),
      answerId: new EntityID(),
      content: faker.lorem.text(),
      ...overrides,
    },
    id,
  )
}
