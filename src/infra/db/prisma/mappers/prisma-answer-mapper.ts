import { type Prisma, type Answer as PrismaAnswer } from '@prisma/client'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { EntityID } from '@/core/entities/value-objects/entity-id'

export class PrismaAnswerMapper {
  static create(asnwer: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      content: asnwer.content,
      questionId: asnwer.questionId.toString(),
      authorId: asnwer.authorId.toString(),
    }
  }

  static toEntity(answer: PrismaAnswer): Answer {
    return Answer.create(
      {
        content: answer.content,
        questionId: new EntityID(answer.questionId),
        authorId: new EntityID(answer.authorId),
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt ?? undefined,
      },
      new EntityID(answer.id),
    )
  }

  static toPersistence(answer: Answer): PrismaAnswer {
    return {
      id: answer.id.toString(),
      content: answer.content,
      questionId: answer.questionId.toString(),
      authorId: answer.authorId.toString(),
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt ?? null,
    }
  }
}
