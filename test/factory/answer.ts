import { EntityID } from '@/core/entities/value-objects/entity-id'
import { AnswerProps, Answer } from '@/domain/forum/enterprise/entities/answer'
import { PrismaAnswerMapper } from '@/infra/db/prisma/mappers/prisma-answer-mapper'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
    const answer = createAnswer(data)

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPersistence(answer),
    })

    return answer
  }
}
