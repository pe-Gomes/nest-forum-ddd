import { EntityID } from '@/core/entities/value-objects/entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { type Comment } from '@prisma/client'

export class PrismaAnswerCommentMapper {
  static toEntity(answerComment: Comment): AnswerComment {
    if (!answerComment.answerId) {
      throw new Error('Invalid comment type.')
    }

    return AnswerComment.create(
      {
        content: answerComment.content,
        answerId: new EntityID(answerComment.answerId),
        authorId: new EntityID(answerComment.authorId),
        createdAt: answerComment.createdAt,
        updatedAt: answerComment.updatedAt ?? undefined,
      },
      new EntityID(answerComment.id),
    )
  }

  static toPersistence(answerComment: AnswerComment): Comment {
    return {
      id: answerComment.id.toString(),
      content: answerComment.content,
      answerId: answerComment.answerId.toString(),
      authorId: answerComment.authorId.toString(),
      questionId: null,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt ?? null,
    }
  }
}
