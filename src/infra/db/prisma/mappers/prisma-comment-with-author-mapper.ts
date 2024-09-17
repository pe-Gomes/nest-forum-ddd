import { EntityID } from '@/core/entities/value-objects/entity-id'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import {
  type Comment as PrismaComment,
  type User as PrismaUser,
} from '@prisma/client'

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser
}

export class PrismaCommentWithAuthorMapper {
  static toEntity(comment: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new EntityID(comment.id),
      content: comment.content,
      authorId: new EntityID(comment.authorId),
      authorName: comment.author.name,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    })
  }
}
