import { EntityID } from '@/core/entities/value-objects/entity-id'
import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'
import { PrismaQuestionCommentMapper } from '@/infra/db/prisma/mappers/prisma-question-comment-mapper'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class QuestionCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaComment(data: Partial<QuestionCommentProps> = {}) {
    const answer = createQuestionComment(data)

    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPersistence(answer),
    })

    return answer
  }
}
