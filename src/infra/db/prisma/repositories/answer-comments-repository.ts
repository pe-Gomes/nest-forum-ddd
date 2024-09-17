import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/app/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper'
import { Injectable } from '@nestjs/common'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private readonly db: PrismaService) {}

  async create(comment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPersistence(comment)

    await this.db.comment.create({ data })
  }

  async getById(id: string): Promise<AnswerComment | null> {
    const comment = await this.db.comment.findUnique({
      where: { id },
    })

    if (!comment) return null

    return PrismaAnswerCommentMapper.toEntity(comment)
  }

  async getManyByAnswerId(
    answerId: string,
    { page, limit }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const comments = await this.db.comment.findMany({
      where: { answerId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    })

    return comments.map((comment) =>
      PrismaAnswerCommentMapper.toEntity(comment),
    )
  }

  async getManyByQuestionIdWithAuthor(
    answerId: string,
    { page, limit }: PaginationParams,
  ) {
    const comments = await this.db.comment.findMany({
      where: { answerId },
      include: {
        author: true,
      },

      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    })

    return comments.map((comment) =>
      PrismaCommentWithAuthorMapper.toEntity(comment),
    )
  }

  async delete(id: string): Promise<void> {
    await this.db.comment.delete({ where: { id } })
  }
}
