import { EntityID } from '@/core/entities/value-objects/entity-id'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { type Comment } from '@prisma/client'

export class PrismaQuestionCommentMapper {
  static toEntity(answerComment: Comment): QuestionComment {
    if (!answerComment.questionId) {
      throw new Error('Invalid comment type.')
    }

    return QuestionComment.create(
      {
        content: answerComment.content,
        questionId: new EntityID(answerComment.questionId),
        authorId: new EntityID(answerComment.authorId),
        createdAt: answerComment.createdAt,
        updatedAt: answerComment.updatedAt ?? undefined,
      },
      new EntityID(answerComment.id),
    )
  }

  static toPersistence(answerComment: QuestionComment): Comment {
    return {
      id: answerComment.id.toString(),
      content: answerComment.content,
      authorId: answerComment.authorId.toString(),
      questionId: answerComment.questionId.toString(),
      answerId: null,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt ?? null,
    }
  }
}
