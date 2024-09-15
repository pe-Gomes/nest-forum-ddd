import { ListRecentQuestionsUseCase } from '@/domain/forum/app/use-cases/list-recent-questions'
import {
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { QuestionPresenter } from '../../presenters/question-presenter'

const listQuestionsQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
})

type ListQuestionsQuery = z.infer<typeof listQuestionsQuerySchema>
const queryValidationPipe = new ZodValidationPipe(listQuestionsQuerySchema)

@Controller('/questions')
export class ListRecentQuestionsController {
  constructor(private listRecentQuestions: ListRecentQuestionsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Query(queryValidationPipe) query: ListQuestionsQuery) {
    const { limit, page } = query

    const result = await this.listRecentQuestions.execute({
      page,
      limit,
    })

    if (result.isFailure()) {
      throw new InternalServerErrorException()
    }

    const questions = result.value.questions.map((i) =>
      QuestionPresenter.toHTTP(i),
    )

    return { questions }
  }
}
