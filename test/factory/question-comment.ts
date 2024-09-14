import { EntityID } from '@/core/entities/value-objects/entity-id'
import {
  QuestionComment,
  type QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'
import { faker } from '@faker-js/faker'

export function createQuestionComment(
  overrides: Partial<QuestionCommentProps> = {},
  id?: EntityID,
) {
  return QuestionComment.create(
    {
      authorId: new EntityID(),
      questionId: new EntityID(),
      content: faker.lorem.text(),
      ...overrides,
    },
    id,
  )
}
