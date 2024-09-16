import { EntityID } from '@/core/entities/value-objects/entity-id'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'
import { PrismaAnswerCommentMapper } from '@/infra/db/prisma/mappers/prisma-answer-comment-mapper'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class AnswerCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaComment(data: Partial<AnswerCommentProps> = {}) {
    const answer = createAnswerComment(data)

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPersistence(answer),
    })

    return answer
  }
}
