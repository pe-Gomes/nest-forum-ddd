import {
  Question,
  type QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { EntityID } from '@/core/entities/value-objects/entity-id'

import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { PrismaQuestionMapper } from '@/infra/db/prisma/mappers/prisma-question-mapper'

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

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(
    data: Partial<QuestionProps> = {},
  ): Promise<Question> {
    const question = createQuestion(data)

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPersistence(question),
    })

    return question
  }
}
