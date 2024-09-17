import { type AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { type AnswerCommentsRepository } from '@/domain/forum/app/repositories/answer-comments-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { type InMemoryStudentsRepository } from './student-repository'

export class InMemoryAnswerCommentRepository
  implements AnswerCommentsRepository
{
  public comments: AnswerComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

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

  async getManyByQuestionIdWithAuthor(
    questionId: string,
    {
      page,
      limit,
    }: {
      page: number
      limit: number
    },
  ) {
    const comments = this.comments
      .filter((comment) => comment.answerId.toString() === questionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * limit, page * limit)
      .map((comment) => {
        const author = this.studentsRepository.students.find((author) =>
          author.id.equals(comment.authorId),
        )

        if (!author) {
          throw new Error(
            `Author with ID ${comment.authorId.toString()} does not exist.`,
          )
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          authorId: comment.authorId,
          authorName: author.name,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt ?? null,
        })
      })

    return comments
  }

  async delete(id: string) {
    const commentIdx = this.comments.findIndex(
      (comment) => comment.id.toString() === id,
    )
    this.comments.splice(commentIdx, 1)
  }
}
