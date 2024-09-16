import { EntityID } from '@/core/entities/value-objects/entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { type Question as PrismaQuestion } from '@prisma/client'

export class PrismaQuestionMapper {
  static toEntity(question: PrismaQuestion) {
    return Question.create(
      {
        title: question.title,
        slug: new Slug(question.slug),
        content: question.content,
        bestAnswerId: question.bestAnswerId
          ? new EntityID(question.bestAnswerId)
          : undefined,
        authorId: new EntityID(question.authorId),
        createdAt: question.createdAt,
        updatedAt: question.updatedAt ?? undefined,
      },
      new EntityID(question.id),
    )
  }

  static toPersistence(question: Question): PrismaQuestion {
    return {
      id: question.id.toString(),
      title: question.title,
      slug: question.slug.value,
      content: question.content,
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId?.toString() ?? null,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt ?? null,
    }
  }
}
