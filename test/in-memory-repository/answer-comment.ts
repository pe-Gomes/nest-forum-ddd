import { type AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { type AnswerCommentsRepository } from '@/domain/forum/app/repositories/answer-comments-repository'

export class InMemoryAnswerCommentRepository
  implements AnswerCommentsRepository
{
  public comments: AnswerComment[] = []

  async create(comment: AnswerComment) {
    await Promise.resolve(this.comments.push(comment))
  }

  async getById(id: string) {
    return await Promise.resolve(
      this.comments.find((comment) => comment.id.toString() === id) ?? null,
    )
  }

  async getManyByAnswerId(
    answerId: string,
    {
      page,
      limit,
    }: {
      page: number
      limit: number
    },
  ) {
    return await Promise.resolve(
      this.comments
        .filter((comment) => comment.answerId.toString() === answerId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice((page - 1) * limit, page * limit),
    )
  }

  async delete(id: string) {
    const commentIdx = this.comments.findIndex(
      (comment) => comment.id.toString() === id,
    )
    this.comments.splice(commentIdx, 1)
  }
}
