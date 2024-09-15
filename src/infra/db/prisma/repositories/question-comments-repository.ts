import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/app/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Injectable } from '@nestjs/common'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private readonly db: PrismaService) {}

  async create(comment: QuestionComment) {
    const data = PrismaQuestionCommentMapper.toPersistence(comment)

    await this.db.comment.create({ data })
  }
  async getById(id: string) {
    const comment = await this.db.comment.findUnique({
      where: { id },
    })

    if (!comment) return null

    return PrismaQuestionCommentMapper.toEntity(comment)
  }
  async getManyByQuestionId(
    questionId: string,
    { page, limit }: PaginationParams,
  ) {
    const comments = await this.db.comment.findMany({
      where: { questionId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    })

    return comments.map((comment) =>
      PrismaQuestionCommentMapper.toEntity(comment),
    )
  }
  async delete(id: string) {
    await this.db.comment.delete({ where: { id } })
  }
}
