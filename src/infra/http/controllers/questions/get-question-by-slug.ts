import { GetQuestionBySlugUseCase } from '@/domain/forum/app/use-cases/get-question-by-slug'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { QuestionPresenter } from '../../presenters/question-presenter'

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('slug') slug: string) {
    const res = await this.getQuestionBySlug.execute({ slug })

    if (res.isFailure()) {
      throw new BadRequestException(res.value.message)
    }

    return { question: QuestionPresenter.toHTTP(res.value.question, true) }
  }
}
