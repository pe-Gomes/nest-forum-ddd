import { ListAnswerCommentsUseCase } from '@/domain/forum/app/use-cases/list-answer-comments'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { AnswerCommentPresenter } from '../../presenters/answer-comment-presenter'
import { z } from 'zod'

const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(20).default(20),
})

type PaginationQuery = z.infer<typeof paginationQuerySchema>

const queryPipe = new ZodValidationPipe(paginationQuerySchema)

@Controller('/answers/:id/comments')
export class ListAnswerCommentsController {
  constructor(private listAnswerComments: ListAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Param('id') answerId: string,
    @Query(queryPipe) query: PaginationQuery,
  ) {
    const { page, limit } = query

    const res = await this.listAnswerComments.execute({
      page,
      limit,
      answerId,
    })

    if (res.isFailure()) {
      throw new BadRequestException()
    }

    const comments = res.value.comments

    return { comments: comments.map((c) => AnswerCommentPresenter.toHTTP(c)) }
  }
}
