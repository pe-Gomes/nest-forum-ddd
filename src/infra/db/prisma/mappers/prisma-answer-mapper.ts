import { type Answer as PrismaAnswer } from '@prisma/client'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { EntityID } from '@/core/entities/value-objects/entity-id'

export class PrismaAnswerMapper {
  toEntity(answer: PrismaAnswer): Answer {
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

  toPersistence(answer: Answer): PrismaAnswer {
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
