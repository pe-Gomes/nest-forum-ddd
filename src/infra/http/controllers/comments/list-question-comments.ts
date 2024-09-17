import { ListQuestionCommentsUseCase } from '@/domain/forum/app/use-cases/list-question-comments'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { z } from 'zod'
import { CommentWithAuthorPresenter } from '../../presenters/comment-with-author-presenter'

const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(20).default(20),
})

type PaginationQuery = z.infer<typeof paginationQuerySchema>

const queryPipe = new ZodValidationPipe(paginationQuerySchema)

@Controller('/questions/:id/comments')
export class ListQuestionCommentsController {
  constructor(private listQuestionComments: ListQuestionCommentsUseCase) {}

  @Get()
  async handle(
    @Param('id') questionId: string,
    @Query(queryPipe) query: PaginationQuery,
  ) {
    const { page, limit } = query

    const res = await this.listQuestionComments.execute({
      page,
      limit,
      questionId,
    })

    if (res.isFailure()) {
      throw new BadRequestException()
    }

    const comments = res.value.comments

    return {
      comments: comments.map((c) => CommentWithAuthorPresenter.toHTTP(c)),
    }
  }
}
