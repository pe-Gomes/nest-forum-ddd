import { ListAnswersForQuestionUseCase } from '@/domain/forum/app/use-cases/list-answers-for-question'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { AnswerPresenter } from '../../presenters/answer-presenter'

const paginationQuerySchema = z.object({
  limit: z.coerce.number().min(20).default(20),
  page: z.coerce.number().min(1).default(1),
})

type PaginationQuery = z.infer<typeof paginationQuerySchema>

const queryPipe = new ZodValidationPipe(paginationQuerySchema)

@Controller('/questions/:id/answers')
export class ListAnswersForQuestionController {
  constructor(private listAnswersForQuestion: ListAnswersForQuestionUseCase) {}

  @Get()
  async handle(
    @Param('id') questionId: string,
    @Query(queryPipe) query: PaginationQuery,
  ) {
    const { limit, page } = query

    const res = await this.listAnswersForQuestion.execute({
      limit,
      page,
      questionId,
    })

    if (res.isFailure()) {
      throw new BadRequestException()
    }

    const answers = res.value.answers

    return { answers: answers.map((a) => AnswerPresenter.toHTTP(a)) }
  }
}
